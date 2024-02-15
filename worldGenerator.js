const container = document.getElementById('container')
const infoWindow = document.getElementById('infoWindow')

//Util function
function vec3( x = 0, y = 0, z = 0 ) {
    return {
        x : x,
        y : y,
        z : z,
    }
}
function addVec3( vec1, vec2 ) {
    return {
        x : vec1.x + vec2.x,
        y : vec1.y + vec2.y,
        z : vec1.z + vec2.z,
    }
}

let map = {
    player : {
        pos : vec3( 0, 0, 0 ),
        rot : vec3( 0, 0, 0 )
    },
    //the world div is now represented by this bundle
    //nested bundles should be avoided
    world : {
        type : 'bundle',
        name : "world",

        position : vec3(0, 0, 0 ),
        rotation : vec3( 0, 0, 0 ),
        children : [
            { type : 'div', position : vec3( 0, 0, 0), rotation : vec3( 90, 0, 0 ), meta : { width : 100, height : 100, texture : 'url("IMG/cracked-asphalt-texture.jpg")', name : 'floor' } },

            { 
                type : "bundle",
                name : "cubiod",

                position : vec3(0, 0, 0),
                rotation : vec3(),

                children : [
                    { type : 'div', position : vec3( 0, 0, 0), rotation : vec3( 0, 0, 0 ), meta : { width : 100, height : 100, color : "red", name : 'Front' } },
                
                ]
            }
        ]
    }
}