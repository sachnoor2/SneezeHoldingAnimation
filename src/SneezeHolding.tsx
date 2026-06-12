import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Audio,
  staticFile,
} from 'remotion';

const DeepNavy = '#0E1117';
const Gold = '#FDCB6E';
const Teal = '#00CEC9';

const Subtitle: React.FC<{text: string; frame: number}> = ({text, frame}) => {
  const spr = spring({frame: frame % 100, fps: 60, config: {stiffness: 100}});
  return (
    <div style={{
      position: 'absolute',
      bottom: 200,
      width: '100%',
      textAlign: 'center',
      fontFamily: 'JetBrains Mono',
      fontSize: 48,
      color: 'white',
      padding: '0 50px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      opacity: interpolate(frame % 100, [0, 10], [0, 1], {extrapolateRight: 'clamp'}),
      transform: `translateY(${interpolate(spr, [0, 1], [20, 0])}px)`
    }}>
      {text}
    </div>
  );
};

export const SneezeHolding: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const scene01 = frame >= 15 && frame < 180;
  const scene02 = frame >= 220 && frame < 480;
  const scene03 = frame >= 520 && frame < 800;
  const scene04 = frame >= 840 && frame < 1100;
  const scene05 = frame >= 1140 && frame < 1400;
  const scene06 = frame >= 1440 && frame < 1700;
  const scene07 = frame >= 1740 && frame < 2050;
  const scene08 = frame >= 2090 && frame < 2350;
  const scene09 = frame >= 2390 && frame < 2650;

  const bgShake = scene02 ? Math.sin(frame) * 2 : 0;

  return (
    <AbsoluteFill style={{backgroundColor: DeepNavy, transform: `translateX(${bgShake}px)`}}>
      <Audio src={staticFile('audio/narration_final.mp3')} />

      {/* Scene 1: Hook */}
      {scene01 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
           <h1 style={{fontFamily: 'Bebas Neue', fontSize: 120, color: Gold, textAlign: 'center'}}>
             NEVER HOLD A<br/>SNEEZE! 🤧
           </h1>
           <Subtitle frame={frame} text="क्या आप भी अपनी छींक रोकते हैं? रुकिए!" />
        </AbsoluteFill>
      )}

      {/* Scene 2: 160 km/h */}
      {scene02 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
           <div style={{
             fontSize: 250, 
             fontFamily: 'Bebas Neue', 
             color: Teal,
             transform: `scale(${spring({frame: frame-220, fps, config: {stiffness: 200}})})`
           }}>
             160 KM/H
           </div>
           <Subtitle frame={frame} text="एक छींक की रफ़्तार 160 km/h तक हो सकती है।" />
        </AbsoluteFill>
      )}

      {/* Scene 3 & 4: Pressure Turning Inward */}
      {(scene03 || scene04) && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
           <div style={{
             width: 400,
             height: 400,
             border: '10px solid white',
             borderRadius: '50%',
             display: 'flex',
             justifyContent: 'center',
             alignItems: 'center',
             overflow: 'hidden'
           }}>
             <div style={{
               width: 300,
               height: 300,
               backgroundColor: 'red',
               opacity: interpolate(frame, [520, 1100], [0.2, 1]),
               borderRadius: '50%',
               transform: `scale(${1 + Math.sin(frame/5)*0.1})`
             }} />
           </div>
           <Subtitle frame={frame} text={scene03 ? "जब आप अपनी नाक और मुँह बंद करते हैं..." : "तो प्रेशर शरीर के अंदर वापस चला जाता है।"} />
        </AbsoluteFill>
      )}

      {/* Scene 5: Ear Drum */}
      {scene05 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
           <div style={{fontFamily: 'Bebas Neue', fontSize: 100, color: 'white'}}>👂 EAR DRUM</div>
           <div style={{
             width: 200, height: 10, backgroundColor: 'red', 
             transform: `rotate(${frame*10}deg) scale(${spring({frame: frame-1140, fps})})`
           }} />
           <Subtitle frame={frame} text="ये आपके कान के पर्दों को फाड़ सकता है।" />
        </AbsoluteFill>
      )}

      {/* Scene 6: Eyes */}
      {scene06 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
           <div style={{fontSize: 200}}>👁️</div>
           <div style={{
             position: 'absolute', width: 500, height: 500, 
             border: '2px solid red', borderRadius: '50%',
             opacity: Math.sin(frame) > 0 ? 1 : 0
           }} />
           <Subtitle frame={frame} text="आपकी आँखों की नसों को फोड़ सकता है।" />
        </AbsoluteFill>
      )}

      {/* Scene 7: Brain */}
      {scene07 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
           <div style={{fontSize: 200}}>🧠</div>
           <div style={{
             position: 'absolute', fontSize: 80, color: 'red',
             transform: `translateY(${Math.sin(frame)*10}px)`
           }}>DANGER!</div>
           <Subtitle frame={frame} text="ये आपके दिमाग की नस भी फाड़ सकता है।" />
        </AbsoluteFill>
      )}

      {/* Scene 8 & 9: Outro */}
      {(scene08 || scene09) && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
           <h1 style={{fontFamily: 'Bebas Neue', fontSize: 120, color: Gold, textAlign: 'center'}}>
             BLESS YOU! 🙏
           </h1>
           <div style={{
             marginTop: 50, padding: '20px 40px', backgroundColor: Gold, color: DeepNavy,
             fontFamily: 'Bebas Neue', fontSize: 60, borderRadius: 10,
             transform: `scale(${spring({frame: frame-2090, fps})})`
           }}>
             SUBSCRIBE
           </div>
           <Subtitle frame={frame} text={scene08 ? "अगली बार छींक आए, तो उसे आने दें।" : "सब्सक्राइब करें ऐसी और जानकारी के लिए!"} />
        </AbsoluteFill>
      )}
      
    </AbsoluteFill>
  );
};
