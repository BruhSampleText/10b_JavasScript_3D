const container = document.getElementById('container')
const infoWindow = document.getElementById('infoWindow')

const deg = Math.PI / 180
const perspective = 600

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

function getTransform( position, rotation ) {
    return `rotateX( ${ rotation.x }deg ) rotateY( ${ rotation.y }deg ) rotateZ( ${ rotation.z }deg ) translate3d(${ position.x }px, ${ position.y }px, ${ position.z }px)`
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
    if ( world != null ) {
        world.style.transform = `translateZ( ${ perspective }px )` +  getTransform( position, rotation )
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


//Main game loop
function game() {
    
    updatePlayerMovement()

    updateWorld()

    myReq = requestAnimationFrame(game)
}

let screenX = container.offsetWidth / 2
let screenY = container.offsetHeight / 2

//Sanity check z is y
//Origin is rotated by 90° on the x axis

function parsDiv( entry, parent ) {
    if ( entry.type != 'div' ) return;

    let div = document.createElement( 'div' )
    div.className = 'plane'
    div.id = entry.meta.name || 'plane'

    div.style.width = ( entry.meta.width || 100 ) + 'px'
    div.style.height = ( entry.meta.height || 100 ) + 'px'
    
    div.style.perspective = Math.max(entry.meta.width, entry.meta.height) * 2; + 'px';

    div.style.transform = 'translate(-50%, -50%) ' + getTransform( 
        vec3(
            entry.position.x,
            entry.position.y,
            entry.position.z,
        ),
        entry.rotation
     )

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

    div.style.width = "0px"
    div.style.height = "0px"

    // div.style.perspective = size
    div.style.transform ='translate(-50%, -50%) ' +  getTransform( bundle.position, bundle.rotation )

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

container.style.perspective = perspective + "px"

world.style.width = container.style.width
world.style.height = container.style.height
//Starting le gaem
game()