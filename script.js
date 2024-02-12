const container = document.getElementById('container')
const infoWindow = document.getElementById('infoWindow')

const deg = Math.PI / 180

document.addEventListener( "keydown", onKeyPress )
document.addEventListener( "keyup", onKeyRelese )
document.addEventListener( "mousemove", onMouseMove )

document.addEventListener( "pointerlockchange", () => { lockedPointer = (document.pointerLockElement != null) } )

container.onclick = function() {
    container.requestPointerLock()
}

let world

let lockedPointer = false
let isInfoPanelOpen = false

let movementSpeed = 6
let sensitivity = 0.2

let position = vec3( 0, 0, 0 )
let rotation = vec3( 0, 0, 0 )

//Valid types: div, bundle
let bundles = {}

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
            { type : 'div', position : vec3( 0, 100, 0), rotation : vec3( 90, 0, 0 ), meta : { width : 2000, height : 2000, texture : 'url("IMG/cracked-asphalt-texture.jpg")', name : 'floor' } },
            
            
            
            { 
                type : "bundle",
                name : "cubiod",

                position : vec3(0, 0, 0),
                rotation : vec3(),

                children : [
                    { type : 'div', position : vec3( 0, 0, 50), rotation : vec3( 0, 0, 0 ), meta : { width : 100, height : 100, color : "red", name : 'Front' } },
                    { type : 'div', position : vec3( 0, 0, -50), rotation : vec3( 0, 0, 0 ), meta : { width : 100, height : 100, color : "yellow", name : 'Back' } },
                    { type : 'div', position : vec3( 50, 0, -100), rotation : vec3( 0, 90, 0 ), meta : { width : 100, height : 100, color : "green", name : 'Left' } },
                    { type : 'div', position : vec3( 50, 0, 0), rotation : vec3( 0, -90, 0 ), meta : { width : 100, height : 100, color : "blue", name : 'Right' } },
                    { type : 'div', position : vec3( 0, 50, 100), rotation : vec3( 90, 0, 0 ), meta : { width : 100, height : 100, color : "pink", name : 'Top' } },
                    { type : 'div', position : vec3( 0, 50, 0), rotation : vec3( -90, 0, 0 ), meta : { width : 100, height : 100, color : "purple", name : 'Bottom' } },
                ]
            }
        ]
    }
}

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

function getTransform( pos, org ) { //
    return `rotateX( ${ org.x }deg ) rotateY( ${ org.y }deg ) translate3d(${ pos.x }px, ${ pos.y }px, ${ pos.z }px)`
}

function clamp( min, max, val ) {
    if ( val < min ) {
        return min
    } else if ( val > max ) {
        return max
    } else return val
}

//Event callbacks
let keymap = { 
    KeyA : false, KeyD : false, KeyW : false, KeyS : false, KeyQ : false, KeyE : false, 
    Space : false, ShiftLeft : false, KeyZ : false,
}

function onKeyPress( event ) {
    
    if ( keymap[ event.code ] != null ) {
        keymap[ event.code ] = true
    }
}
function onKeyRelese( event ) {

    if ( event.code == 'KeyI' ) {
        isInfoPanelOpen = !isInfoPanelOpen
      
        return
    }else if ( event.code == 'KeyR' ) {
        Object.assign( position, map.player.pos )
        Object.assign( rotation, map.player.rot )
      
        return
    }

    if ( keymap[ event.code ] != null ) {
        keymap[ event.code ] = false
    }
}
function onMouseMove( event ) {
    if ( !lockedPointer ) return

    rotation.y += event.movementX * sensitivity
    rotation.x -= event.movementY * sensitivity

    rotation.x = clamp( -70, 70, rotation.x )
}

//Update functions

let test
let cubeRot = vec3()

function updateWorld() {
    world.style.transform = 
        "translateZ( 800px )" + getTransform( position, rotation )
    
    test.style.transform =
        "translateZ( 800px )" + getTransform( vec3(  ), cubeRot )

    cubeRot.x += 5
    if ( cubeRot.x > 360 ) {
        cubeRot.x -= 360
    }
}

function updatePlayerMovement() {
    let facingVector = vec3(
        Math.cos( rotation.y * deg ),
        Math.sin( rotation.y * deg ),
    )

    if ( keymap.ShiftLeft ) {
        movementSpeed = 10
    }else {
        movementSpeed = 6
    }

    if ( keymap.KeyW ) {
        position.z += facingVector.x * movementSpeed
        position.x -= facingVector.y * movementSpeed
    }
    if ( keymap.KeyS ) {
        position.z -= facingVector.x * movementSpeed
        position.x += facingVector.y * movementSpeed
    }

    if ( keymap.KeyA ) {
        position.x += facingVector.x * movementSpeed
        position.z += facingVector.y * movementSpeed
    }
    if ( keymap.KeyD ) {
        position.x -= facingVector.x * movementSpeed
        position.z -= facingVector.y * movementSpeed
    }

    if ( keymap.KeyE ) {
        position.y += movementSpeed
    } 
    if ( keymap.KeyQ ) {
        position.y -= movementSpeed
    } 

    if ( rotation.x > 360 ) { rotation.x -= 360 }
    if ( rotation.x < -360 ) { rotation.x += 360 }
    
    if ( rotation.y > 360 ) { rotation.y -= 360 }
    if ( rotation.y < -360 ) { rotation.y += 360 }

    if ( rotation.z > 360 ) { rotation.z -= 360 }
    if ( rotation.z < -360 ) { rotation.z += 360 }
}

function drawInfoPanel() {

    if (!isInfoPanelOpen) {
        container.style.width = `98%`

        infoWindow.style.width = `0%`
        infoWindow.style.marginRight = `0%`
        infoWindow.style.marginLeft = `0%`
        infoWindow.style.padding = `0%`

        infoWindow.innerHTML = ``
    } 
    else if (isInfoPanelOpen) {
        container.style.width = `84%`

        infoWindow.style.width = `10%`
        infoWindow.style.marginRight = `2%`
        infoWindow.style.marginLeft = `1%`
        infoWindow.style.padding = `1%`

        infoWindow.innerHTML = `
        <h5>The Information Panel</h5>
        <hr>
        <p>Movement speed: ${movementSpeed}px
        Camera sensitivity: ${sensitivity * 100}%
        <hr>
        Players camera coordinates:<br>
        x: ${ position.x }<br>
        y: ${ position.y }<br>
        z: ${ position.z }
        <hr>
        
        Players camera rotation:<br>
        
        x: ${ rotation.x }<br>
        y: ${ rotation.y }<br>
        z: ${ rotation.z }

        <hr>
        </p>
        <p id="finePrint">
        Movement controls:<br>
        w: move forward<br>
        a: move left<br>
        s: move backward<br>
        d: move right<br>
        
        shift: sprint<br>
        <hr>
        <p id="finePrint">Other functions:<br>
        r: reset back to starting position<br>
        i: open & close the information panel<br>
        </p>`
    }
}


//Main game loop
function game() {
    
    updatePlayerMovement()
    
    drawInfoPanel()
    updateWorld()

    myReq = requestAnimationFrame(game)
}

function parsDiv( entry, parent ) {
    if ( entry.type != 'div' ) return;

    let div = document.createElement( 'div' )
    div.className = 'plane'
    div.id = entry.meta.name || 'plane'

    div.style.width = ( entry.meta.width || 100 ) + 'px'
    div.style.height = ( entry.meta.height || 100 ) + 'px'
    
    div.style.transform = getTransform( addVec3(
        entry.position, vec3( -entry.meta.width / 2, -entry.meta.height / 2, 0 )
    ), entry.rotation )

    if ( entry.meta.color ) {
        div.style.background = entry.meta.color
    } else {
        div.style.backgroundImage = entry.meta.texture
    }

    parent.appendChild( div )
    return div
}
function parsBundle( bundle, parent ) {
    if ( bundle.type != 'bundle' ) return;

    let div = document.createElement( "div" )
    div.className = 'bundle'
    div.id = bundle.name || 'bundle'

    div.style.transform = getTransform( bundle.position, bundle.rotation )

    parent.appendChild( div )

    for ( let index = 0; index < bundle.children.length; index++ ) {
        let child = bundle.children[ index ]

        if ( child.type == 'bundle' ) {
            parsBundle( child, div )
        } else {
            parsDiv( child, div )
        }
    }

    return div
}

//Loads in the map as a bundle
world = parsBundle( map.world, container )

Object.assign( position, map.player.pos )
Object.assign( rotation, map.player.rot )

test = document.getElementById( "cubiod" )

//Starting le gaem
game()