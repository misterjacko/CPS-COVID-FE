## Some Background 
The Chicago Public School District (CPS) is the 3rd largest school district in the United States[#]() serving more than 355,000 students in 642 Schools[#](https://www.cps.edu/about/stats-facts/). On #### with the first cases of COVID-19 being reported in the United States including cases in the Chicagoland area, all on-site learning was halted and classes transitioned to a remote model. As COVID-19 ravaged the United States and the world, the children remained home. The 2020 school year completed remote, and the 2021 school year began remote with a plan for future [hybrid learning]() in the works. With the coming of 2021, CPS pulled the trigger and opened their schools to students who opted in to in person learning with [plans in place]() to make learning safe. 


### contemporaneous notes


#### BACK END
The general plan will be to use a cloudwatch chron job timer thing to initiate a lambda function. 

That function will download the updated total numbers from the CPS google sheet, and parse it to get a list of chools and their current totals. 

It will then crawl through that list, and update a dynamoDB table as follows:
- find the matching school. 
- subtract the old total from the current total to find new cases. 
- add an entry in the 'DailyCases' section as `date`:`new cases`
- update the old total to the new total. 
- move on to the next school. 

once it is done crawling through the list, it will either:
- export the table as a json document to an S3 bucket for reading from a web page. `prob this`
- figure out how to have the web page access the dynamoDB directly. 



why oh why are these plroblems so much. 

problem -- solution
chron job. 
put df as csv in s3. (code)
time name. 

permissions problem- local in container vs in cloud. wtf


#### FRONT END

we will get there later. 