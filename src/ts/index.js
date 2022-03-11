import { AmbientLight, BoxGeometry, Color, DodecahedronGeometry, Group, MathUtils, Mesh, PerspectiveCamera, PlaneGeometry, PointLight, Raycaster, Scene, WebGLRenderer } from 'three';
import WEBGL from "three/examples/jsm/capabilities/WebGL";
import "../css/main.css";
import "../image/face.png";
import { SimplexNoise } from "three/examples/jsm/math/SimplexNoise";
import { Materials } from "./Materials";
import "../font/MinecraftBold-nMK1.ttf";
import "../font/MinecraftRegular-Bmg3.ttf";
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader";
import { Font } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import { to2dPosition } from "./util";
// scene and camera and renderer initialization
const scene = createScene();
const camera = createCamera();
const renderer = createRenderer();
window.addEventListener("resize", onResize);
onResize();
// place meshes
const face = placeFace();
placeLights();
const dusts = placeDusts();
let title;
placeTitle();
let textGroup;
placeText();
// event listener initialize
let isMouseButtonClicked = false;
window.addEventListener("mousedown", onMouseDown);
window.addEventListener("mouseup", onMouseUp);
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("wheel", onWheel);
// animation initialize
let tick = 0;
function animate() {
    //dustを動かす
    dusts.forEach((pair) => {
        let mesh = pair.mesh;
        let noise = pair.noise;
        mesh.position.x += noise.noise(0, tick) / 500;
        mesh.position.y += noise.noise(0, tick + 10) / 500;
        mesh.position.z += noise.noise(0, tick + 20) / 500;
        mesh.rotation.x += noise.noise(0, tick) / 100;
        mesh.rotation.y += noise.noise(0, tick + 10) / 100;
        mesh.rotation.z += noise.noise(0, tick + 20) / 100;
    });
    //顔の回転
    face.rotation.x += 0.001;
    face.rotation.y += 0.001;
    //文字をもとに戻す
    try {
        title.rotation.x /= 1.03;
        title.rotation.y /= 1.03;
        title.rotation.z /= 1.03;
        textGroup.rotation.x /= 1.01;
        textGroup.rotation.y /= 1.01;
        textGroup.rotation.z /= 1.01;
    }
    catch (_) {
    }
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
//show
if (WEBGL.isWebGLAvailable()) {
    animate();
}
else {
    document.getElementById("container").appendChild(WEBGL.getWebGLErrorMessage());
}
function createScene() {
    const scene = new Scene();
    scene.background = new Color(0.9, 0.9, 0.9);
    return scene;
}
function createCamera() {
    const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;
    scene.add(camera);
    return camera;
}
function createRenderer() {
    const renderer = new WebGLRenderer();
    let element = renderer.domElement;
    element.id = "canvas";
    document.body.replaceChild(element, document.getElementById("canvas"));
    return renderer;
}
function placeFace() {
    const faceGeometry = new BoxGeometry();
    const cube = new Mesh(faceGeometry, Materials.face);
    cube.scale.set(1.5, 1.5, 1.5);
    scene.add(cube);
    return cube;
}
function placeLights() {
    const ambientLight = new AmbientLight();
    ambientLight.intensity = 0.75;
    scene.add(ambientLight);
    const pointLight = new PointLight();
    pointLight.position.x = -1;
    pointLight.position.y = 1;
    pointLight.position.z = 1;
    scene.add(pointLight);
}
function placeDusts() {
    const dusts = [];
    for (let i = 0; i < 100; i++) {
        const dustGeometry = new DodecahedronGeometry();
        const dust = new Mesh(dustGeometry, Materials.dust);
        dust.scale.x = 0.1;
        dust.scale.y = 0.1;
        dust.scale.z = 0.1;
        dust.position.x = MathUtils.randFloatSpread(10);
        dust.position.y = MathUtils.randFloatSpread(75);
        dust.position.z = MathUtils.randFloatSpread(10);
        scene.add(dust);
        dusts.push({ noise: new SimplexNoise(), mesh: dust });
    }
    return dusts;
}
function placeTitle() {
    new TTFLoader().load("./font/MinecraftBold-nMK1.ttf", (json) => {
        const textGeometry = getTextGeometry("Propromp", new Font(json), 0.008, 50);
        textGeometry.rotateX(0.2);
        title = new Mesh(textGeometry, Materials.title);
        title.position.y = 3;
        scene.add(title);
    });
}
function placeText() {
    new TTFLoader().load("./font/MinecraftRegular-Bmg3.ttf", (json) => {
        textGroup = new Group();
        const font = new Font(json);
        const aboutMeGeo = getTextGeometry("About me", font, 0.004, 1);
        aboutMeGeo.translate(0, 0.75, 0);
        const aboutMe = new Mesh(aboutMeGeo, Materials.title);
        const aboutMeContentGeo1 = getTextGeometry("I'm Propromp! I'm making ton of junks by using Kotlin!!", font, 0.002, 0.0);
        const aboutMeContent1 = new Mesh(aboutMeContentGeo1, Materials.title);
        const aboutMeContentGeo2 = getTextGeometry("I'm currently interested in Rust (and Go)", font, 0.002, 0.0);
        aboutMeContentGeo2.translate(0, -0.5, 0);
        const aboutMeContent2 = new Mesh(aboutMeContentGeo2, Materials.title);
        const contactGeo = getTextGeometry("Contact", font, 0.004, 1);
        contactGeo.translate(0, -1.25, 0);
        const contact = new Mesh(contactGeo, Materials.text);
        const discord = getContactElement("Propromp#7777", font, Materials.discord, () => {
        });
        discord.translateY(-2.0);
        const twitter = getContactElement("@RPropromp", font, Materials.twitter, () => {
            window.open("https://twitter.com/rpropromp");
        });
        twitter.translateY(-2.5);
        const email = getContactElement("info@propromp.net", font, Materials.email, () => {
            window.open("info@propromp.net");
        });
        email.translateY(-3.0);
        textGroup.add(aboutMe, aboutMeContent1, aboutMeContent2, contact, discord, twitter, email);
        textGroup.position.y = -7;
        scene.add(textGroup);
    });
}
function getContactElement(text, font, material, callback) {
    const textGeo = getTextGeometry(text, font, 0.002, 0.0);
    const textMesh = new Mesh(textGeo, Materials.text);
    const iconGeo = new PlaneGeometry();
    const icon = new Mesh(iconGeo, material);
    icon.scale.set(0.5, 0.5, 0.5);
    icon.translateX(-((textGeo.boundingBox.max.x - textGeo.boundingBox.min.x) / 2 + 0.5));
    icon.addEventListener("click", callback);
    const group = new Group();
    group.add(icon, textMesh);
    group.translateX((textGeo.boundingBox.max.x - textGeo.boundingBox.min.x) / 2);
    group.translateX(-0.8);
    return group;
}
function getTextGeometry(text, font, scale, height) {
    const textGeometry = new TextGeometry(text, {
        font: font,
        height: height
    });
    textGeometry.scale(scale, scale, scale);
    textGeometry.computeBoundingBox();
    textGeometry.translate(-(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) / 2, -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) / 2, -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) / 2);
    textGeometry.computeBoundingBox();
    return textGeometry;
}
function onMouseDown() {
    isMouseButtonClicked = true;
}
function onMouseUp() {
    isMouseButtonClicked = false;
}
const rayCaster = new Raycaster();
function onMouseMove(event) {
    //動かすやつ
    if (isMouseButtonClicked) {
        face.rotation.x += event.movementY / 100;
        face.rotation.y += event.movementX / 100;
    }
    let screenFacePosition = to2dPosition(face.position, camera);
    face.rotation.x += event.movementY / ((Math.abs(screenFacePosition.y) + 100) * 5);
    face.rotation.y += event.movementX / ((Math.abs(screenFacePosition.x) + 100) * 5);
    let screenTitlePosition = to2dPosition(title.position, camera);
    title.rotation.x += event.movementY / ((Math.abs(screenTitlePosition.y) + 100) * 2);
    title.rotation.y += event.movementX / ((Math.abs(screenTitlePosition.x) + 100) * 2);
    let screenTextPosition = to2dPosition(textGroup.position, camera);
    textGroup.rotation.x += event.movementY / ((Math.abs(screenTextPosition.y) + 100) * 4);
    textGroup.rotation.y += event.movementX / ((Math.abs(screenTextPosition.x) + 100) * 4);
}
function onResize() {
    let width = window.innerWidth;
    let height = window.innerHeight;
    camera.aspect = width / height;
    renderer.setSize(width, height);
    camera.updateProjectionMatrix();
}
function onWheel(event) {
    if (0 < event.deltaY) { //down
        camera.position.y -= 0.1;
    }
    else { //up
        if (camera.position.y < 0) {
            camera.position.y += 0.1;
        }
    }
}
