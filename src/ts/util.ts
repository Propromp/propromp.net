import {Camera, Vector2, Vector3} from "three";

export {to2dPosition,toArray}

function to2dPosition(vector3: Vector3, camera: Camera): Vector2 {
    let vector = vector3.clone()
    vector.project(camera)
    let centerX = window.innerWidth / 2
    let centerY = window.innerHeight / 2
    return new Vector2(
        (vector.x * centerX) + centerX,
        -(vector.y * centerY) + centerY
    )
}
function toArray<T>(iterator: IterableIterator<T>): T[] {
    const array:T[] = []
    while(true) {
        let next = iterator.next()
        if(!next.done) break;
        array.push(next.value)
    }
    return array
}