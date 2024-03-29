
var colordic={};
for(var i = 0; i <100; i++) {
    colordic[Highcharts.color(Highcharts.getOptions()
        .colors[i]).setOpacity(0.5).get()] = i;
}


function getn(n) {
    return Math.random() * n;
  }
var n =20
alld=[]
djs=[]
for(var i =8; i>=0;i--)
{
    //data with mean u and standard deviation s
    var u = i*30;
    var s = getn(100)/5;
    var data = [];
    for(var j =0; j<n;j++){
        data.push([u*(j+1*25)+getn(s)*10,u+getn(s)*(10)]);
    }
    // var data = new Array((i+1)*20).fill().map((_) => {return [getn((i+2)*40),getn((i+2)*20*(i+1))]});
    djs.push(data);

}

var datajs
async function getdatajs(){
    const response = await fetch('URL');
    datajs = await response.json();
}
// getdatajs(); //Call the function when you want to get the data from a URL


datajs = [
    {
        "id": 1,
        "name": "Polymers",
        "data": djs[
            0
        ],
        "hasdepth": false
    },
    {
        "id": 2,
        "name": "Elastomers",
        "data": [
            {
                "id": 3,
                "name": "Elastomer Fibers",
                "data": djs[
                    1
                ],
                "hasdepth": false
            },
            {
                "id": 4,
                "name": "Elastomer Films",
                "data": djs[
                    2
                ],
                "hasdepth": false
            }
        ],
        "hasdepth": true
    },
    {
        "id": 5,
        "name": "Metal Composites",
        "data": djs[
            3
        ],
        "hasdepth": false
    },
    {
        "id": 6,
        "name": "Ferrous Metals",
        "data": [
            {
                "id": 7,
                "name": "Ferrous Metal Alloys",
                "data": djs[
                    4
                ],
                "hasdepth": false
            },
            {
                "id": 8,
                "name": "Ferric Oxides",
                "data": [
                    {
                        "id": 9,
                        "name": "Ferric Oxide Nanoparticles",
                        "data": djs[
                            5
                        ],
                        "hasdepth": false
                    },
                    {
                        "id": 10,
                        "name": "Ferric Oxide Nanowires",
                        "data": djs[
                            6
                        ],
                        "hasdepth": false
                    },
                    {
                        "id": 11,
                        "name": "Ferric Oxide Nanorods",
                        "data": djs[
                            7
                        ],
                        "hasdepth": false
                    }
                ],
                "hasdepth": true
            }
        ],
        "hasdepth": true
    }
]


/**
 * Following down from here contains the data manapilation and the chart functions. A dfs is run over the data and child and parent trees are formed
 */


var expanded={}; 
var parenttree={};
var childrentree={};
var cur=0;



function dfs(key){
    expanded[key.id] = {};
    if(key.hasdepth){
        var tempdata=[];
        childrentree[key.id]=[];
        for(var i =0;i<key.data.length;i++){
            tempdata.push(...dfs(key.data[i]));
            childrentree[key.id].push(key.data[i].id);
            parenttree[key.data[i].id]=key.id;

        }
        tempdata=tempdata;
        expanded[key.id].data=tempdata;
        expanded[key.id].name=key.name;
        return tempdata;
    }
    else{
        var data = key.data;
        data = data;
        expanded[key.id].data=data;
        expanded[key.id].name=key.name;
        return data;
    }
}



for(var i =0; i<datajs.length;i++)
{
    dfs(datajs[i]);
}


function formatter(key){
    var s = {
        name: expanded[key].name,
        type: 'polygon',
        marker: {
            symbol: 'square'
        },
        data: convexHull(expanded[key].data),
        color: Highcharts.color(Highcharts.getOptions()
            .colors[key]).setOpacity(0.5).get(),
        enableMouseTracking: false,
        allowPointSelect:true,
        accessibility: {
            exposeAsGroupOnly: false,
            description: 'Material'
        },
        borderColor : "#000000",

}
return s;
}

function displaydata(key){
    let ddata =[]
    cur = key;
    if(childrentree[key]){
        for(var i =0; i<childrentree[key].length;i++){
            ddata.push(formatter(childrentree[key][i]));
        }
    }
    else{
        ddata.push(formatter(key));
    }
    


    for (var i = alld.length-1; i >=0; i--) {
        chart.series[i].remove();  
    }
    ddata= ddata.sort()
    alld=ddata;
    console.log(ddata);
    for (var i = 0; i < ddata.length; i++) {
        chart.addSeries(ddata[i]);  
    }
    chart.redraw();
    

}



function getdata(){
    return alld;
}

childrentree[0]=[];
for(var i =0;i<datajs.length;i++){
    alld.push(formatter(datajs[i].id));
    childrentree[0].push(datajs[i].id);
}
// datajs =[{
//     "id":1,
//     "name": "M1",
//     "data":[[1,2],[0,1]],
//     "parent":null,
//     "children":[2,3]
// },
// {
//     "id":2,
//     "name": "M2",
//     "data": null,
//     "parent":null
// },
// {
//     "id":3,
//     "name": "M2.1",
//     "data":[[2,3],[3,4]],
//     "parent":2,
// },{
//     "id":4,
//     "name": "M2.2",
//     "data":[[4,5],[5,6]],
//     "parent": 2
// }
// ]

// datajs = 
// {
//     1: {
//         "name": "M1",
//         "data":[[1,2],[0,1]],
//         "parent": null
//     },
//     2: {
//         "name": "M2",
//         "data": null,
//         "parent": null
//     },
//     3: {
//         "name": "M2.1",
//         "data":[[2,3],[3,4]],
//         "parent": 2
//     },
//     4: {
//         "name": "M2.2",
//         "data":[[4,5],[5,6]],
//         "parent": 2
//     }
// }

// for(var i=0;i<datajs.length;i++)
// {
//     var data = datajs[i];
//     if(data.hasdepth)
//     {
//         for(var j=0;j<data.data.length;j++)
//         {
//             var data2 = data.data[j];
//             alld.push(data2);
//         }
//     }

// }
