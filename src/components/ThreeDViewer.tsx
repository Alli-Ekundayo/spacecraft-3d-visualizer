
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ThreeDViewerProps {
  sceneData?: any;
  isLoading?: boolean;
}

const ThreeDViewer: React.FC<ThreeDViewerProps> = ({ sceneData, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const frameIdRef = useRef<number>(0);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set up scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f9fa);
    sceneRef.current = scene;
    
    // Set up camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;
    
    // Set up renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Set up controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;
    
    // Add resize handler
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);
  
  // Update scene when new data is received
  useEffect(() => {
    if (!sceneData || !sceneRef.current || !cameraRef.current) return;
    
    // Clear existing scene
    while (sceneRef.current.children.length > 0) {
      sceneRef.current.remove(sceneRef.current.children[0]);
    }
    
    // Add new scene objects
    if (sceneData.scene) {
      sceneData.scene.children.forEach((child: THREE.Object3D) => {
        sceneRef.current?.add(child.clone());
      });
    }
    
    // Update camera position if provided
    if (sceneData.camera) {
      const { position, lookAt } = sceneData.camera;
      if (position && cameraRef.current) {
        cameraRef.current.position.set(position.x, position.y, position.z);
      }
      if (lookAt && cameraRef.current) {
        cameraRef.current.lookAt(new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z));
      }
    }
    
    // Reset controls target if needed
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 1, 0);
      controlsRef.current.update();
    }
  }, [sceneData]);
  
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>3D Preview</CardTitle>
        <CardDescription>
          Rotate: Left click + drag | Zoom: Scroll | Pan: Right click + drag
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[400px]">
          <div 
            ref={containerRef}
            className="absolute inset-0 rounded-lg overflow-hidden"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-lg">
              <div className="loading-spinner" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeDViewer;
