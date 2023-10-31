import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

window.addEventListener("DOMContentLoaded", async function () {
    let data = {
        winWidth: window.innerWidth,
        winHeight: window.innerHeight,
    };

    // Create Scene
    const scene = new THREE.Scene();
    scene.background = null;
    // scene.add(new THREE.AxesHelper(3));

    // Add a light
    const light = new THREE.PointLight(0xffffff, 1000);
    light.position.set(2.5, 7.5, 15);
    scene.add(light);

    // Add a camera
    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(2.5, 1.4, 1.5);

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(300, 300);

    var container = document.getElementById("canvas");
    container.appendChild(renderer.domElement);

    // Add the canvas to the DOM
    // document.body.appendChild( renderer.domElement );

    // Add the orbit controls
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.target.set(0, 0, 0);

    var animationObject;
    var mixer;
    let idleAction;
    var animationsArray = [];
    let walkingAction;
    let presentingAction;
    var modelReady = false;

    // Load our FBX model from the directory
    var loader = new FBXLoader();
    // var loader = new GLTFLoader();
    loader
        .loadAsync(
            "/idle_char_2.fbx", // main object + anim 1
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            }
        )
        .then((object) => {
            // Scale and position the model
            object.scale.set(0.01, 0.007, 0.01);
            object.position.set(2.5, 0.5, 0);

            // console.log(object.animations);
            // console.log(camera.position);

            object.traverse((o) => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                }
            });

            // Start the default animation
            mixer = new THREE.AnimationMixer(object);
            animationsArray.push(object.animations[0]);

            // Add it to the scene
            scene.add(object);

            // load next
            loader.load(
                "/walking_char_2.fbx", // anim 2
                function (object) {
                    animationsArray.push(object.animations[0]);

                    console.log(object.animations[0]);

                    scene.add(object);
                },
                (xhr) => {
                    console.log(
                        (xhr.loaded / xhr.total) * 100 + "% loaded animation 1"
                    );
                },
                (error) => {
                    console.log(error);
                }
            );

            // load next
            loader.load(
                "/arm_gesture_char_2.fbx", // anim 2
                function (object) {
                    animationsArray.push(object.animations[0]);

                    scene.add(object);
                },
                (xhr) => {
                    console.log(
                        (xhr.loaded / xhr.total) * 100 + "% loaded animation 2"
                    );
                },
                (error) => {
                    console.log(error);
                }
            );

            modelReady = true;
            animationObject = object;
            console.log(object.animations, animationsArray);
            let idleAction = mixer.clipAction(animationsArray[0]);
            idleAction.play();
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            activateSpeechBubble(speechBubble); // activate intro text
            // setTimeout(() => {
            //     speak(speechBubble); // activate speech with slight delay
            // }, 2000);
        });
    // var doneLoading = await loader.loadAsync(
    //     "/idle_char_2.fbx", // main object + anim 1
    //     function (object) {
    //         // Scale and position the model
    //         object.scale.set(0.01, 0.007, 0.01);
    //         object.position.set(2.5, 0.5, 0);

    //         // console.log(object.animations);
    //         // console.log(camera.position);

    //         object.traverse((o) => {
    //             if (o.isMesh) {
    //                 o.castShadow = true;
    //                 o.receiveShadow = true;
    //             }
    //         });

    //         // Start the default animation
    //         mixer = new THREE.AnimationMixer(object);
    //         animationsArray.push(object.animations[0]);

    //         // Add it to the scene
    //         scene.add(object);

    //         // load next
    //         loader.load(
    //             "/walking_char_2.fbx", // anim 2
    //             function (object) {
    //                 animationsArray.push(object.animations[0]);

    //                 console.log(object.animations[0]);

    //                 scene.add(object);
    //             },
    //             (xhr) => {
    //                 console.log(
    //                     (xhr.loaded / xhr.total) * 100 + "% loaded animation 1"
    //                 );
    //             },
    //             (error) => {
    //                 console.log(error);
    //             }
    //         );

    //         // load next
    //         loader.load(
    //             "/arm_gesture_char_2.fbx", // anim 2
    //             function (object) {
    //                 animationsArray.push(object.animations[0]);

    //                 scene.add(object);
    //             },
    //             (xhr) => {
    //                 console.log(
    //                     (xhr.loaded / xhr.total) * 100 + "% loaded animation 2"
    //                 );
    //             },
    //             (error) => {
    //                 console.log(error);
    //             }
    //         );

    //         modelReady = true;
    //         animationObject = object;
    //         console.log(object.animations, animationsArray);
    //         let idleAction = mixer.clipAction(animationsArray[0]);
    //         idleAction.play();
    //     },
    //     (xhr) => {
    //         console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    //     },
    //     (error) => {
    //         console.log(error);
    //     }
    // );

    // Add animation routine
    var clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        // Call the animate on the objec
        if (modelReady) mixer.update(clock.getDelta());

        renderer.render(scene, camera);
    }

    animate();
    // activateSpeechBubble(speechBubble); // activate intro text

    /* Activate and Deactivate Speech Bubbles */
    function deActivateSpeechBubble(speechBubble) {
        // turn display to none
        console.log("I am to deactivate the speech bubble");
        speechBubble.classList.replace("show", "hide");
    }
    let speechBubble = document.getElementsByClassName("speechBubble")[0];
    deActivateSpeechBubble(speechBubble); // deactivate intro text

    function activateSpeechBubble(speechBubble) {
        // turn display to block
        console.log("activating speech bubble");
        speechBubble.classList.replace("hide", "show");
    }

    let playBtn = document.getElementsByClassName("fa-play")[0];
    playBtn.addEventListener("click", (e) => {
        speak(speechBubble); // activate speech with slight delay
    });

    function speak(speechBubble) {
        // console.log("Sppech Bubble text:", text);
        let utterance = new SpeechSynthesisUtterance();
        utterance.text = speechBubble.innerText;
        utterance.volume = 1;
        utterance.voice = window.speechSynthesis.getVoices()[9];
        window.speechSynthesis.speak(utterance);
    }

    function setSpeechText(text) {
        speechBubble.innerText = text;
    }

    function moveSpeechBubble(right, bottom) {
        // set general border to 10px solid transparent + opposite of pos to 15px solid rgba(0, 0 ,0, 0.6)
    }

    function alignSpeechBubblePointer(position) {
        // set general border to 10px solid transparent + opposite of pos to 15px solid rgba(0, 0 ,0, 0.6)
    }

    // await window.addEventListener(
    //     "click",
    //     deActivateSpeechBubble(speechBubble)
    // ); // fix this

    // ============= javascript animation:

    // a. animate .fbx object to change direction
    // b. play .fbx animation
    // c. animte div to move around

    function moveCanvas(x, y) {
        // const canvas = document.getElementById("canvas");
        animationObject.rotateY(300); // tilt animation slightly in direction of movement
        let walkingAction = mixer.clipAction(animationsArray[1]);
        let presentingAction = mixer.clipAction(animationsArray[2]);

        walkingAction.play();
        let canvasDiv = document.getElementsByClassName("threeJS")[0];

        const animMovement = [{ transform: `translate(-${x}px, -${y}px)` }];

        const animTiming = {
            duration: 2955,
            iterations: 1,
            delay: 3,
            fill: "forwards",
            easing: "cubic-bezier(0.46,0.03,0.52,0.96)",
        };

        canvasDiv.animate(animMovement, animTiming);

        // canvasDiv.style.right = `${x}px`;
        // canvasDiv.style.bottom = `${y}px`;

        setTimeout(() => {
            // after anim, re-orient character + presentingAction
            animationObject.rotateY(-350);
            walkingAction.stop();
            presentingAction.setLoop(THREE.LoopOnce);
            presentingAction.play();
        }, 3000);

        console.log(animationObject.position);
    }

    function getCoordinates(event) {
        let x = event.clientX;
        let y = event.clientY;

        x = data.winWidth - x;
        y = data.winHeight - y;

        console.log(x, y);
        return { x, y };
    }

    // get demoBtn
    let demoBtn = document.getElementById("demoBtn");

    // on click on demoBtn
    demoBtn.addEventListener("click", (e) => {
        deActivateSpeechBubble(speechBubble);
        let coOrds = getCoordinates(e);

        moveCanvas(coOrds.x, coOrds.y); // move canvas and play animations

        // set speech text
        newSpeechtext =
            "On your right, my left, You can see a brief description for the hero page, along with an animation next to it.";
        setSpeechText(newSpeechtext);
        // in betwew=en here ..re-align, speech bubble
        activateSpeechBubble(speechBubble);
    });
});
