console.log("Exercise 6-1");

//Set up drawing environment with margin conventions
var margin = {t:20,r:20,b:20,l:20};
var width = document.getElementById('plot').clientWidth - margin.l - margin.r,
    height = document.getElementById('plot').clientHeight - margin.t - margin.b;

var plot = d3.select('#plot')
    .append('svg')
    .attr('width',width + margin.l + margin.r)
    .attr('height',height + margin.t + margin.b)
    .append('g')
    .attr('class','plot-area')
    .attr('transform','translate('+margin.l+','+margin.t+')');

//This is just to help you visualize the extent of the <g.plot-area> element
var background = plot.append('rect')
    .attr('width',width)
    .attr('height',height)
    .style('stroke','rgb(100,100,100)')
    .style('stroke-width','2px')
    .style('fill-opacity',.03)

//Start importing data
d3.csv('../data/world_bank_2012.csv', parse, dataLoaded);

function parse(d){

    /*if( d['GDP per capita, PPP (constant 2011 international $)'] == ".."){
        return;
        ^excludes from final results if returns nothing. Stops function.*/
    
    var newRow={
    gdpPerCap:(d['GDP per capita, PPP (constant 2011 international $)'] == "..")?undefined:+d['GDP per capita, PPP (constant 2011 international $)'],
    primCompRate:(d['Primary completion rate, total (% of relevant age group)'] =="..")?undefined:+d['Primary completion rate, total (% of relevant age group)'],
    UrbanPop:(d['Urban population (% of total)']=="..")?undefined:+d['Urban population (% of total)'],
    cCode:d['Country Code'],
    country:d['Country Name'],
    };   

    return newRow;

    //What are some issues we might encounter as we parse this?
}


function dataLoaded(error, rows){
    var minGdpPerCap= d3.min(rows, function(d) {return d.gdpPerCap}),
        maxGDPPerCap= d3.max(rows, function(d) {return d.gdpPerCap;});

    var minPrimCompRate= d3.min(rows, function(d) {return d.primCompRate}),
        maxPrimCompRate= d3.max(rows, function(d) {return d.primCompRate;});

    var minUrbanPop= d3.min(rows, function(d) {return d.UrbanPop}),
        maxUrbanPop= d3.max(rows, function(d) {return d.UrbanPop;});

    console.log(minGdpPerCap, maxGDPPerCap);
    console.log(minPrimCompRate, maxPrimCompRate);
    console.log(minUrbanPop, maxUrbanPop);

    var scaleX = d3.scale.linear()
        .domain([minGdpPerCap, 20000])
        .range([0, width]);
    var scaleY = d3.scale.linear()
        .domain([minPrimCompRate,maxPrimCompRate])
        .range([height, 0]);

    rows.forEach(function(country){

        if (country.gdpPerCap == undefined || country.primCompRate == undefined){
            return;
        }
        var xPos = scaleX(country.gdpPerCap)
        var yPos = scaleY(country.primCompRate)
        var node = plot.append ('g')
        .attr('class','country')
        .attr('transform','translate ('+xPos+','+yPos+')');
        node
            .append('circle')
            .attr('r',country.UrbanPop)
            .style('fill', 'rgb(100,0,0)')
            //.style('stroke','white')
            .style('fill-opacity',.25);
        node
            .append('text')
            .text(country.cCode);


    });

    console.log(rows);


}
