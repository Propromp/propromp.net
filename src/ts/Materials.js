import { Color, MeshBasicMaterial, MeshStandardMaterial, TextureLoader } from "three";
import "../image/face.png";
import "../image/discord.svg";
import "../image/twitter.svg";
import "../image/email.svg";
const textureLoader = new TextureLoader();
const face = new MeshStandardMaterial();
face.map = textureLoader.load("image/face.png");
const dust = new MeshBasicMaterial({
    color: new Color(0.6 + Math.random() * 0.3, 0.6 + Math.random() * 0.3, 0.6 + Math.random() * 0.3)
});
const title = new MeshBasicMaterial();
title.color = new Color(0x222222);
const text = new MeshBasicMaterial();
text.color = new Color(0x222222);
const discord = new MeshBasicMaterial({
    transparent: true,
});
discord.map = textureLoader.load("image/discord.svg");
const twitter = new MeshBasicMaterial({
    transparent: true
});
twitter.map = textureLoader.load("image/twitter.svg");
const email = new MeshBasicMaterial({
    transparent: true
});
email.map = textureLoader.load("image/email.svg");
const Materials = {
    face: face,
    dust: dust,
    title: title,
    text: text,
    discord: discord,
    twitter: twitter,
    email: email
};
export { Materials };
