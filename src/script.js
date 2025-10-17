import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')

/**
 * Fonts 
 */
const fontLoader = new FontLoader()
const parsedFont = fontLoader.parse(typefaceFont) 

// Create text geometry
const textGeometry = new TextGeometry(
    'Hello Three.js',
    {
        font: parsedFont,
        size: 0.6,           
        height: 0.2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
    }
)

// Center text
textGeometry.center()
textGeometry.computeBoundingBox()
console.log(textGeometry.boundingBox)
textGeometry.translate(
    - textGeometry.boundingBox.max.x * 0.5,
    - textGeometry.boundingBox.max.y * 0.5,
    - textGeometry.boundingBox.max.z * 0.5
)

/**
 * Materials
 */
const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })
const donutMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

/**
 * Text Mesh
 */
const text = new THREE.Mesh(textGeometry, textMaterial)
scene.add(text)

/**
 * Donuts
 */
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
// keep your extra line (but we’ll rename to avoid conflict)
// const text = new THREE.Mesh(textGeometry, material) 
// const text = new THREE.Mesh(textGeometry, material) 
// scene.add(text) 

for (let i = 0; i < 100; i++)
{
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)

    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    const scale = Math.random()
    donut.scale.set(scale, scale, scale)

    scene.add(donut)
}

/**
 * Object  (optional cube)
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )
// scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
)
camera.position.set(0, 0, 3)
scene.add(camera)

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Rotate text slowly
    text.rotation.y = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on next frame
    window.requestAnimationFrame(tick)
}

tick()