// var pointRadius = 1;
// var hullPadding = 5; 
//          //                 });
// var vecFrom = function (p0, p1) {               // Vector from p0 to p1
//     return [ p1[0] - p0[0], p1[1] - p0[1] ];
// }

// var vecScale = function (v, scale) {            // Vector v scaled by 'scale'
//     return [ scale * v[0], scale * v[1] ];
// }

// var vecSum = function (pv1, pv2) {              // The sum of two points/vectors
//     return [ pv1[0] + pv2[0], pv1[1] + pv2[1] ];
// }

// var vecUnit = function (v) {                    // Vector with direction of v and length 1
//     var norm = Math.sqrt (v[0]*v[0] + v[1]*v[1]);
//     return vecScale (v, 1/norm);
// }

// var vecScaleTo = function (v, length) {         // Vector with direction of v with specified length
//     return vecScale (vecUnit(v), length);
// }

// var unitNormal = function (pv0, p1) {           // Unit normal to vector pv0, or line segment from p0 to p1
//     if (p1 != null) pv0 = vecFrom (pv0, p1);
//     var normalVec = [ -pv0[1], pv0[0] ];
//     return vecUnit (normalVec);
// };


// // Hull Generators

// var lineFn = d3.line()
//     .curve (d3.curveCatmullRomClosed)
//     .x (function(d) { return d.p[0]; })
//     .y (function(d) { return d.p[1]; });


// var smoothHull = function (polyPoints) {
//     // Returns the SVG path data string representing the polygon, expanded and smoothed.

//     var pointCount = polyPoints.length;

//     // Handle special cases
//     if (!polyPoints || pointCount < 1) return "";
//     if (pointCount === 1) return smoothHull1 (polyPoints);
//     if (pointCount === 2) return smoothHull2 (polyPoints);

//     var hullPoints = polyPoints.map (function (point, index) {
//         var pNext = polyPoints [(index + 1) % pointCount];
//         return {
//             p: point,
//             v: vecUnit (vecFrom (point, pNext))
//         };
//     });

//     // Compute the expanded hull points, and the nearest prior control point for each.
//     for (var i = 0;  i < hullPoints.length;  ++i) {
//         var priorIndex = (i > 0) ? (i-1) : (pointCount - 1);
//         var extensionVec = vecUnit (vecSum (hullPoints[priorIndex].v, vecScale (hullPoints[i].v, -1)));
//         hullPoints[i].p = vecSum (hullPoints[i].p, vecScale (extensionVec, hullPadding));
//     }

//     return hullPoints;
// }

function polarAngle(a, b, c) {
    let x = (a[0] - b[0]) * (c[0] - b[0]) + (a[1] - b[1]) * (c[1] - b[1]);
    let y = (a[0] - b[0]) * (c[1] - b[1]) - (c[0] - b[0]) * (a[1] - b[1]);
    return Math.atan2(y, x);
}

function convexHull(p_list) {
    if (p_list.length < 3) return p_list;

    let hull = [];
    let tmp;

    // Find leftmost point
    tmp = p_list[0];
    for (const p of p_list) if (p[0] < tmp[0]) tmp = p;

    hull[0] = tmp;

    let endpoint, secondlast;
    let min_angle, new_end;

    endpoint = hull[0];
    secondlast = [endpoint[0], endpoint[1]+10];

    do {
        min_angle = Math.PI; // Initial value. Any angle must be lower that 2PI
        for (const p of p_list) {
            tmp = polarAngle(secondlast, endpoint, p);

            if (tmp <= min_angle) {
                new_end = p;
                min_angle = tmp;
            }
        }

        if (new_end != hull[0]) {
            hull.push(new_end);
            secondlast = endpoint;
            endpoint = new_end;
        }
    } while (new_end != hull[0]);
    hull.push(hull[0]);
    // hull = catmullrom(hull);
    // hull = bspline(hull);  
    // hull = bezier(hull);
    hull = midpointcurve(hull); 
    



    return hull ;
}

function catmullrom(ddata){
    if(ddata.length<3){
        return ddata
    }
    var data =[];
    for(var i=0;i<ddata.length-2;i++){
        let p1 = ddata[i]
        let p2 = ddata[(i+1)%ddata.length]
        let p3 = ddata[(i+2)%ddata.length]
        let p4 = ddata[(i+3)%ddata.length]

        let d1 = Math.sqrt((p2[0]-p1[0])**2+(p2[1]-p1[1])**2)
        let d2 = Math.sqrt((p3[0]-p2[0])**2+(p3[1]-p2[1])**2)
        let d3 = Math.sqrt((p4[0]-p3[0])**2+(p4[1]-p3[1])**2)

        let v1 = [p2[0]-p1[0],p2[1]-p1[1]]
        let v2 = [p3[0]-p2[0],p3[1]-p2[1]]
        let v3 = [p4[0]-p3[0],p4[1]-p3[1]]

        let v1n = [v1[0]/d1,v1[1]/d1]
        let v2n = [v2[0]/d2,v2[1]/d2]
        let v3n = [v3[0]/d3,v3[1]/d3]

        let v1n2 = [v1n[0]+v2n[0],v1n[1]+v2n[1]]
        let v2n2 = [v2n[0]+v3n[0],v2n[1]+v3n[1]]
        
        for(var j=0;j<100;j++){
            let t = j/100
            let x = (2*t**3-3*t**2+1)*p2[0]+(-2*t**3+3*t**2)*p3[0]+(t**3-2*t**2+t)*d2*v1n2[0]+(t**3-t**2)*d3*v2n2[0]
            let y = (2*t**3-3*t**2+1)*p2[1]+(-2*t**3+3*t**2)*p3[1]+(t**3-2*t**2+t)*d2*v1n2[1]+(t**3-t**2)*d3*v2n2[1]
            data.push([x,y])
        }

    }

        return data;


    }


function bezier(ddata){
    if(ddata.length<3){
        return ddata
    }
    var data =[];
    for(var i=0;i<ddata.length-2;i++){
        let p1 = ddata[i]
        let p2 = ddata[(i+1)%ddata.length]
        let p3 = ddata[(i+2)%ddata.length]
        let p4 = ddata[(i+3)%ddata.length]
        let p5 = ddata[(i+4)%ddata.length]


        let d1 = Math.sqrt((p2[0]-p1[0])**2+(p2[1]-p1[1])**2)
        let d2 = Math.sqrt((p3[0]-p2[0])**2+(p3[1]-p2[1])**2)
        let d3 = Math.sqrt((p4[0]-p3[0])**2+(p4[1]-p3[1])**2)

        let v1 = [p2[0]-p1[0],p2[1]-p1[1]]
        let v2 = [p3[0]-p2[0],p3[1]-p2[1]]
        let v3 = [p4[0]-p3[0],p4[1]-p3[1]]

        let v1n = [v1[0]/d1,v1[1]/d1]
        let v2n = [v2[0]/d2,v2[1]/d2]
        let v3n = [v3[0]/d3,v3[1]/d3]

        let v1n2 = [v1n[0]+v2n[0],v1n[1]+v2n[1]]
        let v2n2 = [v2n[0]+v3n[0],v2n[1]+v3n[1]]
        
        for(var j=0;j<100;j++){
            let t = j/100
            let x = (1-t)**3*p2[0]+3*(1-t)**2*t*p3[0]+3*(1-t)*t**2*p4[0]+t**3*p5[0]
            let y = (1-t)**3*p2[1]+3*(1-t)**2*t*p3[1]+3*(1-t)*t**2*p4[1]+t**3*p5[1]
            data.push([x,y])
        }
       
}
    return data;
}

function midpointcurve(ddata){
    if(ddata.length<3){
        return ddata
    }

    var data =[];
    for(var i=0;i<ddata.length;i++){
        for(var j=0;j<100;j++){
            let t = j/100
            let p1 = ddata[i]
            let p2 = ddata[(i+1)%ddata.length]
            let p3 = ddata[(i+2)%ddata.length]
            let p4 = ddata[(i+3)%ddata.length]

            let x = (1-t)*p1[0]+t*p2[0]
            let y = (1-t)*p1[1]+t*p2[1]
            data.push([x,y])

            let x2 = (1-t)*p2[0]+t*p3[0]
            let y2 = (1-t)*p2[1]+t*p3[1]
            data.push([x2,y2])



            // let x3 = (1-t)*p3[0]+t*p4[0]
            // let y3 = (1-t)*p3[1]+t*p4[1]
            // data.push([x3,y3])
        }
    }

    return data;

}
function bspline(ddata){
    if(ddata.length<3){
        return ddata
    }

    var data =[];
    n= 5
    k=4

    //control points

    var cpoints = []
    for(var i=0;i<ddata.length;i++){
        cpoints.push(ddata[i])
    }

    //knot vector
    var knot = []
    for(var i=0;i<n+k+1;i++){
        if(i<k){
            knot.push(0)
        }
        else if(i>=k && i<n){
            knot.push(i-k+1)
        }
        else{
            knot.push(n-k+2)
        }
    }

    const N = (i,k,t) => {
        if(k==1){
            if(t>=knot[i] && t<knot[i+1]){
                return 1
            }
            else{
                return 0
            }
        }
        else{
            let a = (t-knot[i])/(knot[i+k-1]-knot[i])
            let b = (knot[i+k]-t)/(knot[i+k]-knot[i+1])
            return a*N(i,k-1,t)+b*N(i+1,k-1,t)
        }
    }


    for(var i=0;i<n;i++){
        for(var j=0;j<100;j++){
            let t = j/100
            let x = 0
            let y = 0
            for(var l=0;l<k;l++){
                x += cpoints[i+l][0]*N(i,l,t,knot)
                y += cpoints[i+l][1]*N(i,l,t,knot)
            }
            data.push([x,y])
        }
    }
    return data;
}
