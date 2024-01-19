from datetime import datetime
from bs4 import BeautifulSoup
import cloudscraper
import pandas as pd
import re
import json
from datetime import datetime 
import requests
import time

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'}
SCRAPPER = cloudscraper.create_scraper(delay = 20, browser = "chrome")

# Function to get the timezone of country
def Get_timezone(location, api_key):
    split = location.split(',')
    city = split[0].strip()
    country = split[1].strip()

    base_url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        "text": f"{city}, {country}",
        "apiKey": api_key,
        "limit": 1,  # Limit to 1 result
    }
    try:
        response = requests.get(base_url, params=params)
        data = response.json()

        if response.status_code == 200 and data.get("features"):
            location = data["features"][0]["properties"]["timezone"]
            return location['offset_STD']
        else:
            print(f"Unable to determine location for {location}.")
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None

# Function to convert string to datetime.
def Convert_to_datetime(date):
    date_format = "%B %d, %Y"
    converted_date=  datetime.strptime(date, date_format)
    return converted_date

# Function to convert a string to camel case format.
def Convert_to_camel_case (title):
    words = title.split(' ')
    if len(words) >= 2:
        camel_case = words[0].lower() + ''.join(word.capitalize() for word in words[1:])
        return camel_case
    return title.lower()

# Function to check a string is in digit format.
def is_number_using_isdigit(s):
    return s.isdigit()

# Function to check a string is in Shortname's format.
def is_short_name(s):
    return s.isupper()

# Function to process the title.
def process_title_name(title):
    # Construct the month pattern dynamically
    month_pattern = r' on [A-Za-z]+ \d{1,2}'

    # Search for the month pattern in the text
    match = re.search(month_pattern, title)

    if match:
        # Splitting the text based on the matched pattern
        parts = re.split(month_pattern, title, maxsplit=1)
        
        # The result will be a list with two elements
        # The first element contains the text before the matched pattern
        # The second element contains the text after the matched pattern
        if(is_number_using_isdigit(parts[0].split()[-1])):
            return ' '.join(parts[0].split()[:-2])
        elif(is_short_name(parts[0].split()[-1])):
            return ' '.join(parts[0].split()[:-1])
        else:
            return ' '.join(parts[0].split()[:])
    else:
        return title

def process_date_time(date):
    if '-' in date:
        start_date_str = " "
        end_date_str = " "

        if re.match(r"(\w+\s+\d+)-(\d+),\s+(\d{4})", date):
            month, days, year = date.split(' ')
            start_day, end_day = days.split('-')

            start_date_str = f"{month} {start_day}, {year}"
            end_date_str = f"{month} {end_day} {year}"
        
        elif re.match(r"(\w+\s+\d+)-(\w+\s+\d+),\s+(\d{4})", date):
            year = date.split(',')[-1]
            start_date_str, end_date_str = date.split('-')
            start_date_str = start_date_str + ', ' + year.strip()

        elif re.match(r"(\w+\s+\d+,\s+\d{4})-(\w+\s+\d+),\s+(\d{4})", date):
            start_date_str, end_date_str = date.split('-')

        start_date = Convert_to_datetime(start_date_str.strip()).isoformat() + 'Z'
        end_date = Convert_to_datetime(end_date_str.strip()).isoformat() + 'Z'
        date = [start_date, end_date]
    else:
        date = Convert_to_datetime(date).isoformat() + 'Z'
    
    return date
        


# Get links of conferences 
def Collect_links (url, filename):
    last_page = Get_total_page(url)

    for i in range(1, last_page + 1):
        url = url+ '?page=' + str(i) 
        content = SCRAPPER.get(url, headers = headers)
        soup = BeautifulSoup( content.text, 'html.parser')

        with open (filename, 'w') as file:
            ul_tags = soup.find_all('ul', class_ = 'list-unstyled')

            for ul_tag in ul_tags:
                li_tags = ul_tag.find_all('li')

                for li_tag in li_tags:
                    a_tags = li_tag.find_all('a')

                    for a_tag in a_tags:
                        file.write(a_tag['href'])
                        file.write('\n')
        file.close()

# Get the total page of the website
def Get_total_page(url):

    content = SCRAPPER.get(url, headers = headers)
    soup = BeautifulSoup(content.text, 'html.parser')
    pages = soup.find_all('li', class_ = 'page-item')

    if (pages):
        num_of_pages = []

        for page in pages:
            num_of_pages.append( page.find(class_ = 'page-link').text)
        return int(num_of_pages[-2])
    else:
        return 1

# Get the addtional information of a conference like description, timeline, and accepted papers.
def Extract_additional_data(url):
    
    # Some initials
    accpeted_papers = []
    cleaned_description = ""
    important_dates = {}
    content = None

    # Get accepted papers
    if ("https://waset.org") in url:
        try :
            papers_url = url + '/selected-papers'
            content = SCRAPPER.get(papers_url, headers = headers)

            if content:
                soup = BeautifulSoup(content.text, 'html.parser')
                mt_3 = soup.find('div', class_ = 'mt-3')

                if mt_3:
                    list = soup.find('ol')

                    if list:
                        papers = list.find_all('li')

                        for paper in papers:
                            paper_info = {}
                            info = paper.text.split('\n')
                            paper_info['title'] = info[1].strip()
                            paper_info['description'] = info[2].strip()
                            accpeted_papers.append(paper_info)
        except Exception as e:
            pass

        # Get descritption and important dates
        content = SCRAPPER.get(url, headers = headers)

        if content: 
            soup = BeautifulSoup(content.text, 'html.parser')
            title = soup.find('div', class_ = 'clearfix')

            if title:
                description = soup.find_all('p')

                if len(description) > 2:
                    description = description[1].get_text(strip = True).replace('\n', '')
                    cleaned_description = re.sub(r'\s+', ' ', description).strip()

            date_table = soup.find('table', class_ = 'table table-sm table-striped')
            if date_table:
                dates = date_table.find_all('tr')

                for date in dates:
                    info  = date.text.split('\n')
                    date = info[3].strip()
                    important_dates[Convert_to_camel_case(info[1].strip())] = process_date_time(date)
        else:
            cleaned_description = "None"

    return (cleaned_description, accpeted_papers, important_dates)

# Get all the basic data of the conference
def Extract_data(url):
    
    content = SCRAPPER.get(url, headers = headers)
    soup = BeautifulSoup(content.text, 'html.parser')
    attributes = {}

    if content:
        # Get the title
        title = soup.find('title')
        cleaned_title = process_title_name(title.text)
        attributes['title'] = cleaned_title
        
        features = soup.find_all('ul', class_ = 'mb-2 list-unstyled')

        for feature in features:
            list = feature.find_all('li')

            for item in list:
                match = re.match(r'(.*?):\s*(.*)', item.text.replace('\n', ' ').strip())

                if match:
                    title = match.group(1).strip()
                    value = match.group(2).strip()
                    title = Convert_to_camel_case(title)
                    attributes[title] = value

        attributes['timeline'] = {}
        if 'date' in attributes:
            attributes['timeline']['conferenceDates'] = process_date_time(attributes['date'])
        if 'websiteUrl' in attributes:
            description, accepted_papers, important_dates = Extract_additional_data(attributes['websiteUrl'])
            attributes['description'] = description
            attributes['acceptedPapers'] = accepted_papers
            time_zone = Get_timezone(attributes['location'], api)
            important_dates['timeZone'] = "UTC"+ time_zone
           
            existing_timeline = attributes.get('timeline', {})
            existing_timeline.update(important_dates)
            attributes['timeline'] = existing_timeline

    return attributes

topics_dict = {   
        'software-engineering': 'Software Engineering',
        'computer-science' : 'Computer Science',
        'computer-vision' : 'Computer Vision',
        'data-science' : 'Data Science',
        'information-technology' : 'Information Technology',
        'artificial-intelligence' : 'Artificial Intelligence',
        'information-systems' : 'Information Systems'
    }
fields = ['title', 'shortName','topic', 'location', 'websiteUrl', 'description', 'timeline', 'speakers', 'acceptedPapers']
api = 'f6b48c721d4c46abbe6f5c0620e1eba2' 

def main():
    base_url = 'https://conferenceindex.org/conferences/'
    
    # Collect links to the conferences
    for topic in list(topics_dict.keys()):
        url = base_url + topic
        file_name = 'Conference_links/' + topic + '.txt'
        Collect_links(url, file_name)

    
    df = pd.DataFrame(columns = fields)

    for topic in list(topics_dict.keys()):
        urls = []

        with open('Conference_links/' + topic + '.txt', 'r') as file:
            for line in file.readlines():
                    urls.append(line)

        for i in range(0, len(urls), 100):
            for j, url in enumerate(urls[i : i + 100]):
                if url[-1] == '\n':
                    url = url[:-1]
                print(j, url)
                
                try:
                    features = Extract_data(url)

                    if features and  features['description'] != "None":
                        new_row = pd.Series(features, index = fields)
                        new_row_df = pd.DataFrame([new_row])
                        new_row_df['topic'] = topics_dict[topic]

                        df = pd.concat([df, new_row_df], ignore_index = True)
                except:
                    continue

            time.sleep(20)
    df.to_json("..\database\Conferences.json", orient='records', indent=2)
if __name__ == "__main__":
    main()

