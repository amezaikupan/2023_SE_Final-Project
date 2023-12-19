from bs4 import BeautifulSoup
import cloudscraper
import pandas as pd
import re
import json

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:100.0) Gecko/20100101 Firefox/100.0'}

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
                            paper_info['Title'] = info[1].strip()
                            paper_info['Description'] = info[2].strip()
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
                    description = description[1].get_text(strip = True).replace('\n', '')
                    cleaned_description = re.sub(r'\s+', ' ', description).strip()

            date_table = soup.find('table', class_ = 'table table-sm table-striped')
            if date_table:
                dates = date_table.find_all('tr')

                for date in dates:
                    info  = date.text.split('\n')
                    important_dates[info[1].strip()] = info[3].strip()
        else:
            cleaned_description = 'None'

    return (cleaned_description, accpeted_papers, important_dates)

# Get all the basic data of the conference
def Extract_data(url):
    scraper = cloudscraper.create_scraper(delay= 20, browser="chrome") 
    content = scraper.get(url, headers= headers)
    soup = BeautifulSoup(content.text, 'html.parser')

    # Get the title
    title = soup.find('title')
    attributes = {}
    attributes['Title'] = title.text
    
    features = soup.find_all('ul', class_ = 'mb-2 list-unstyled')

    for feature in features:
        list = feature.find_all('li')

        for item in list:
            match = re.match(r'(.*?):\s*(.*)', item.text.replace('\n', ' ').strip())

            if match:
                title = match.group(1).strip()
                value = match.group(2).strip()

                if title == 'Location':
                    value = match.group(2).split(',')[-1].strip()

                attributes[title] = value

    if 'Website URL' in attributes:
        description, accepted_papers, important_dates = Extract_additional_data(attributes['Website URL'])
        attributes['Description'] = description
        attributes['Accepted papers'] = accepted_papers
        attributes['Timeline'] = important_dates

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
      
def main():
    base_url = 'https://conferenceindex.org/conferences/'
    
    # Collect links to the conferences
    # for topic in list(topics_dict.keys()):
    #     url = base_url + topic
    #     file_name = 'Conference_links/' + topic + '.txt'
    #     Collect_links(url, file_name)

    fields = ['Title', 'Short Name','Category', 'Location', 'Website URL', 'Description', 'Timeline', 'Speakers', 'Accepted papers']
    df = pd.DataFrame(columns = fields)

    for topic in list(topics_dict.keys()):
        urls = []

        with open('Conference_links/' + topic + '.txt', 'r') as file:
    
            for line in file.readlines():
                    urls.append(line)
        
        for i, url in enumerate(urls[:]):
            if url[-1] == '\n':
                url = url[:-1]
            
            features = Extract_data(url)

            if features['Description'] != "None":
                new_row = pd.Series(features, index = fields)
                new_row_df = pd.DataFrame([new_row])
                new_row_df['Category'] = topics_dict[topic]

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
    df.to_json("Conferences.json", orient='records', indent=2)

if __name__ == "__main__":
    # main()
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

    url = 'https://conferenceindex.org/event/ijs-conference-2023-december-singapore-sg'
    feature = Extract_data(url)
    print(feature)

