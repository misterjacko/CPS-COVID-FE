# CPS-COVID FRONT-END README:
Dashboard for tracking reported COVID-19 cases at Chicago Public Schools

## Project Intro

This is the front-end of the Chicago Public Schools Covid tracking website found at [cpscovid.com](https://cpscovid.com).

<!-- The repository for the back-end can be found [here]() -->

## Technology stack: 
  
Back-End CSV file containing case data is parsed with [Papa Parse]() and the map framework used is [Leaflet]()

The site is hosted on S3 as a static site with CloudFront as a CDN provider. It is written primarily in JavaScript.

## Status:  
- MVP.

## Known issues/technical debt
- Because the data layer is a csv file, care needs to be taken as to the load put on client devices to download that file and the parsing that needs to happen to display the data. As the data-set grows, client load considerations may need to be revisited.

## TODO
- More informative popouts ie. School histogram containing running 7 or 14 day averages, weekly summaries etc.
- Search box to find and zoom in on school.

## Contact
- http://www.jakobondrey.com


----

## Credits and references

1. [CPS Dataset](https://www.cps.edu/school-reopening-2020/)
    -   [-Data-](https://docs.google.com/spreadsheets/d/1dMtr8hhhKjPyyNg7i6V52iMQXEqa67E9iAmECeOqZ6c)
2. [School Loaction Dataset](https://catalog.data.gov/organization/86c0c3d9-3826-47ab-a773-6924b858dd04?groups=local&tags=cps) 
    - [-Data-](https://data.cityofchicago.org/api/views/d2h8-2upd/rows.csv?accessType=DOWNLOAD)
3. [Papa Parse]()
4. [Leaflet]()
