"use client"

import { useEffect, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import {
  type ISourceOptions,
} from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.

export default function HomeParticles() {

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);

  const options: ISourceOptions = useMemo(
    () => (
      {
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "repulse"
            },
            onHover: {
              enable: true,
              mode: "bubble"
            }
          },
          modes: {
            bubble: {
              distance: 400,
              duration: 2,
              opacity: 0,
              size: 0,
              speed: 3
            },
            repulse: {
              distance: 400,
              duration: 0.4
            }
          }
        },
        particles: {
          color: { value: "#ffffffbb" },
          move: {
            direction: "none",
            enable: true,
            outModes: "out",
            random: true,
            speed: 0.3
          },
          number: {
            density: {
              enable: true
            },
            value: 30
          },
          opacity: {
            animation: {
              enable: true,
              speed: 2
            },
            value: { min: 0.3, max: 0.6 }
          },
          shape: {
            type: "circle"
          },
          size: {
            value: 1.2
          }
        }
      }
    ),
    []
  );

  return (
    <Particles
      id="tsparticles"
      options={options}
    />
  );
}
