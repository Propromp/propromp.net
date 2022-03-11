import { Vector2 } from "three";
export { to2dPosition, toArray };
function to2dPosition(vector3, camera) {
    let vector = vector3.clone();
    vector.project(camera);
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight / 2;
    return new Vector2((vector.x * centerX) + centerX, -(vector.y * centerY) + centerY);
}
function toArray(iterator) {
    const array = [];
    while (true) {
        let next = iterator.next();
        if (!next.done)
            break;
        array.push(next.value);
    }
    return array;
}
