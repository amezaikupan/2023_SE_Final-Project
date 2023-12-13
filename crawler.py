from bs4 import BeautifulSoup
import cloudscraper
import pandas as pd
import requests
import pymongo
from selenium import webdriver
import re
import json


def Collect_links (url, filename):
    last_page = Get_total_page(url)
    scraper = cloudscraper.create_scraper(delay=10, browser="chrome")

    for i in range(1, last_page + 1):
        url =url+ '?page=' + str(i) 
        content = scraper.get(url)
        soup = BeautifulSoup(content.text, 'html.parser')

        with open (filename, 'w') as file:
            ul_tags = soup.find_all('ul', class_='list-unstyled')
            for ul_tag in ul_tags:
                li_tags = ul_tag.find_all('li')
                for li_tag in li_tags:
                    a_tags = li_tag.find_all('a')
                    for a_tag in a_tags:
                        file.write(a_tag['href'])
                        file.write('\n')

def Get_total_page(url):
    scraper = cloudscraper.create_scraper(delay=10, browser="chrome") 
    content = scraper.get(url)
    soup = BeautifulSoup(content.text, 'html.parser')
    pages = soup.find_all('li', class_='page-item')
    if (pages):
        num_of_pages = []
        for page in pages:
            num_of_pages.append( page.find(class_ = 'page-link').text)
        return int(num_of_pages[-2])
    else:
        return 1

def Extract_timeline_and_paper(url):
    scraper = cloudscraper.create_scraper(delay=20, browser="chrome")
    
    #Extract the accepted papers
    accpeted_papers = []
    paper_url = url + '/selected-papers'
    content = scraper.get(paper_url)
    if content:
        soup = BeautifulSoup(content.text, 'html.parser')
        list = soup.find('ol')
        if list:
            papers = list.find_all('li')
            for paper in papers:
                paper_info = {}
                info = paper.text.split('\n')

                paper_info['Title'] = info[1].strip()
                paper_info['Description'] = info[2].strip()
                accpeted_papers.append(paper_info)

    content = scraper.get(url)
    soup = BeautifulSoup(content.text, 'html.parser')
    important_dates = {}
    date_table = soup.find('table', class_ = 'table table-sm table-striped')
    if date_table:
        dates = date_table.find_all('tr')

        for date in dates:
            info  = date.text.split('\n')
            important_dates[info[1].strip()] = info[3].strip()

    return (accpeted_papers, important_dates)


def Extract_data(url):
    scraper = cloudscraper.create_scraper(delay=20, browser="chrome") 
    content = scraper.get(url)
    soup = BeautifulSoup(content.text, 'html.parser')

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
                attributes[title] = value

    if 'Website URL' in attributes:
    # TODO: add extract timeline and papers 
        accepted_papers, important_dates = Extract_timeline_and_paper(attributes['Website URL'])
        attributes['Accepted papers'] = accepted_papers
        attributes['Timeline'] = important_dates

    # print(attributes['Conference Tags'])

    return attributes
            


def main():
    base_url = 'https://conferenceindex.org/conferences/'
    topics = ['software-engineering', 'computer-science', 'computer-vision', 'data-science', 'information-technology', 'artificial-intelligence', 'information-systems']

    fields = ['Title', 'Short Name','Category', 'Location', 'Website URL', 'Timeline', 'Speakers', 'Accepted papers']
    df = pd.DataFrame(columns = fields)
    for topic in topics:
        urls = []
        with open('Conference_links/' + topic + '.txt', 'r') as file:
            for line in file.readlines():
                    urls.append(line)
        
        for url in urls[:3]:
            if url[-1] == '\n':
                url = url[:-1]
            print(url)
            features = Extract_data(url)
            new_row = pd.Series(features, index = fields)
            new_row_df = pd.DataFrame([new_row])
            new_row_df['Category'] = topic
            df = pd.concat([df, new_row_df], ignore_index = True)
            

    df.to_json("Conferences.json", orient='records', indent= 2)
if __name__ == "__main__":
    main()

