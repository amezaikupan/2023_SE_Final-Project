from bs4 import BeautifulSoup
import cloudscraper
import pandas as pd
import re
import json
from datetime import datetime 
import time
import requests
import schedule

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'}

# Function to get the timezone of country
def Get_timezone(location, api_key):

    base_url = "https://api.geoapify.com/v1/geocode/search"
    params = {
        "text": location.strip(),
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
    
def Convert_to_datetime(date):
    date_format = "%B %d, %Y"
    converted_date=  datetime.strptime(date, date_format)
    return converted_date

def Convert_to_camel_case (title):
    words = title.split(' ')

    if len(words) >= 2:
        return words[0].lower() + words[1].strip()
    return title.lower()

# Get links of conferences 
def Collect_links (url, filename):
    last_page = Get_total_page(url)
    scraper = cloudscraper.create_scraper(delay = 20, browser = "chrome")

    for i in range(1, last_page + 1):
        url = url+ '?page=' + str(i) 
        content = scraper.get(url, headers = headers)
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
    scraper = cloudscraper.create_scraper(delay = 20, browser = "chrome") 
    content = scraper.get(url, headers = headers)
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
    scraper = cloudscraper.create_scraper(delay = 20, browser = "chrome")
    
    # Some initials
    accpeted_papers = []
    cleaned_description = ""
    important_dates = {}
    content = None

    if ("https://waset.org") in url:
        try :
            papers_url = url + '/selected-papers'
            content = scraper.get(papers_url, headers = headers)

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
            print(f"Error while scraping {url}: {e}")
            pass

        content = scraper.get(url, headers = headers)

        if content: 
            soup = BeautifulSoup(content.text, 'html.parser')
            title = soup.find('div', class_ = 'clearfix')

            if title:
                description = soup.find_all('p')

                if len(description) > 2:
                    description = description[1].get_text(strip = False).replace('\n', ' ')
                    cleaned_description = re.sub(r'\s+', ' ', description).strip()
                    # 
                

            date_table = soup.find('table', class_ = 'table table-sm table-striped')
            if date_table:
                dates = date_table.find_all('tr')

                for date in dates:
                    info  = date.text.split('\n')
                    date = info[3].strip()
                    if '-' in date:
                        month, days, year = date.split(" ")
                        start_day, end_day = days.split('-')

                        start_date_str = f"{month} {start_day}, {year}"
                        end_date_str = f"{month} {end_day} {year}"
                       
                        start_date = Convert_to_datetime(start_date_str).isoformat()
                        end_date = Convert_to_datetime(end_date_str).isoformat()
                        date = [start_date, end_date]
                    else:
                        date = Convert_to_datetime(date).isoformat()
                       
                    important_dates[info[1].strip()] = date
        else:
            cleaned_description = "None"

    return (cleaned_description, accpeted_papers, important_dates)

# Get all the basic data of the conference
def Extract_data(url):
    scraper = cloudscraper.create_scraper(delay = 20, browser = "chrome") 
    attributes = {}

    try:
        content = scraper.get(url, headers = headers)
        soup = BeautifulSoup(content.text, 'html.parser')

        if content.status_code == 200:
            # Get the title
            title = soup.find('title')
            
            attributes['title'] = title.text
            
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

            if 'websiteURL' in attributes:
                description, accepted_papers, important_dates = Extract_additional_data(attributes['websiteURL'])
                attributes['description'] = description
                attributes['acceptedPapers'] = accepted_papers
                time_zone = Get_timezone(attributes['location'], api)
                important_dates['timeZone'] = "UTC"+ time_zone
                attributes['timeline'] = important_dates

        elif content.status_code == 404:
            print(f'Cannot access: {url}. Error 404 - Not Found')
            return attributes
        else:
            print(f'Cannot access: {url}. Status code: {content.status_code}')
            return attributes
    except requests.exceptions.RequestException as e:
        print(f"Error while scraping {url}: {e}")
        pass

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
fields = ['title', 'shortName','topic', 'location', 'websiteURL', 'description', 'timeline', 'speakers', 'acceptedPapers']
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
                
                features = Extract_data(url)

                if features and  features['description'] != "None":
                    new_row = pd.Series(features, index = fields)
                    new_row_df = pd.DataFrame([new_row])
                    new_row_df['topic'] = topics_dict[topic]

                    df = pd.concat([df, new_row_df], ignore_index = True)
                    # try:
                    #     with open('Conferences.json', 'r') as file:
                    #         existing_data = json.load(file)
                    # except (FileNotFoundError, json.decoder.JSONDecodeError):
                    #     existing_data = []

                    # existing_data_list = existing_data if isinstance(existing_data, list) else []
                    # new_data_list = new_row_df.to_dict(orient='records')

                    # combined_data = existing_data_list + new_data_list
                    # with open('Conferences.json', 'w') as file:
                    #     json.dump(combined_data, file, indent=2)
            time.sleep(20)
    df.to_json("Conferences.json", orient='records', indent=2)

def main2():
    url = 'https://conferenceindex.org/event/international-conference-on-sports-analytics-and-data-science-icsads-2024-august-new-york-us'
    feature = Extract_data(url)

    if feature:
        for key, value in feature.items():
            print(f'{key} - {value}')
    else:
        print("Khong co j het")
if __name__ == "__main__":
    main2()
    # import math

    # def replace_nan_with_null(data):
    #     if isinstance(data, dict):
    #         return {k: replace_nan_with_null(v) for k, v in data.items()}
    #     elif isinstance(data, list):
    #         return [replace_nan_with_null(item) for item in data]
    #     elif isinstance(data, float) and math.isnan(data):
    #         return None
    #     else:
    #         return data

    # file_path = 'Conferences.json'
    # with open(file_path, 'r') as file:
    #     json_data = json.load(file)

    # updated_data = replace_nan_with_null(json_data)
    
    # with open(file_path, 'w') as file:
    #     json.dump(updated_data, file, indent= 2)


#
