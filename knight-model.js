import * as T from './vendor/three.module.js';
export function createKnight(){
const root=new T.Group();root.name='Mechanica Knight — reference reconstruction';
const silver=new T.MeshStandardMaterial({color:0xb7bdc1,metalness:1,roughness:.26});const edge=new T.MeshStandardMaterial({color:0xe1e4e5,metalness:1,roughness:.2});const dark=new T.MeshStandardMaterial({color:0x20272b,metalness:.8,roughness:.38});const rubber=new T.MeshStandardMaterial({color:0x101519,metalness:.2,roughness:.65});const glow=new T.MeshStandardMaterial({color:0x94ff5b,emissive:0x63f22f,emissiveIntensity:1.5});
function mesh(g,m,p,s=[1,1,1],parent=root){const o=new T.Mesh(g,m);o.position.set(...p);o.scale.set(...s);parent.add(o);return o}
function ball(p,s,m=silver,parent=root){return mesh(new T.SphereGeometry(1,32,24),m,p,s,parent)}
function box(p,s,m=silver,parent=root){return mesh(new T.BoxGeometry(...s),m,p,[1,1,1],parent)}
function cyl(p,r1,r2,h,m=silver,parent=root){return mesh(new T.CylinderGeometry(r1,r2,h,32),m,p,[1,1,1],parent)}
function ring(p,r,t,m=edge,parent=root){let o=mesh(new T.TorusGeometry(r,t,10,48),m,p,[1,1,1],parent);o.rotation.x=Math.PI/2;return o}
function plate(points,depth,p,m=silver,parent=root){const sh=new T.Shape();points.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));sh.closePath();return mesh(new T.ExtrudeGeometry(sh,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.055,bevelThickness:.045}),m,p,[1,1,1],parent)}
function rod(a,b,r,m=dark,parent=root){const va=new T.Vector3(...a),vb=new T.Vector3(...b),d=vb.clone().sub(va);const o=mesh(new T.CylinderGeometry(r,r,d.length(),10),m,va.clone().add(vb).multiplyScalar(.5).toArray(),[1,1,1],parent);o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return o}
function decal(text,p,w,h,color='#e6e9e7',parent=root){const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle=color;x.textAlign='center';x.textBaseline='middle';x.font='bold 160px Arial';x.fillText(text,256,135);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;return mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2}),p,[1,1,1],parent)}
// Rounded forged shells replace the flat polygonal torso and visor of v2.
function shell(profile,p,scale,m=silver,parent=root){const pts=profile.map(([r,y])=>new T.Vector2(r,y));return mesh(new T.LatheGeometry(pts,48),m,p,scale,parent)}
function buckle(p,parent=root,scale=1){const g=new T.Group();g.position.set(...p);g.scale.setScalar(scale);parent.add(g);box([0,0,-.018],[.13,.19,.035],dark,g);const hoop=mesh(new T.TorusGeometry(.065,.012,6,16),edge,[0,0,.015],[1,1.4,1],g);rod([-.058,0,.03],[.058,0,.03],.009,edge,g);return g}
function seam(points,parent=root,r=.015,m=edge){for(let i=1;i<points.length;i++)rod(points[i-1],points[i],r,m,parent)}
ball([0,.77,0],[.83,1.03,.51],dark);
const cuirass=shell([[0,-.87],[.53,-.86],[.71,-.71],[.86,-.36],[.94,.05],[.91,.4],[.72,.76],[.4,.89],[0,.89]],[0,.86,0],[1,1,.68]);
// Distinct collar, breast ridge, overlapping articulated belly plates.
ring([0,1.76,0],.4,.09,edge).scale.z=1.1;
seam([[0,1.71,.24],[0,1.47,.51],[0,1.1,.64],[0,.68,.61],[0,.16,.43]],root,.018);
for(let i=0;i<3;i++){const y=.13-i*.15;const band=shell([[.55,-.09],[.59,-.08],[.66,.05],[.64,.09]],[0,y,0],[1,1,.77],silver);ring([0,y+.075,0],.645,.025,edge).scale.z=.77;}
// Side clasps and dark under-arm openings visible in the references.
for(const side of [-1,1]){for(let i=0;i<2;i++)buckle([side*.68,1.42-i*.48,.37],root,.86);for(let j=0;j<3;j++)rod([side*.72,.9-j*.14,.0],[side*.97,1.15-j*.13,-.09],.026,dark);}
decal('𝔴',[.29,1.08,.66],.64,.43);decal('✳',[-.31,1.32,.57],.17,.17);
// Rounded sallet with projecting central ridge and actual cut-through visor vents.
cyl([0,1.86,0],.28,.33,.25,dark);const head=new T.Group();head.position.set(0,2.32,.015);root.add(head);
ball([0,0,-.06],[.61,.7,.59],silver,head);
// A raised, swept rear helmet rim.
const rim=mesh(new T.TorusGeometry(.54,.045,8,48),edge,[0,-.21,-.045],[1,1,1],head);rim.rotation.x=Math.PI/2;rim.scale.z=1.08;
const outline=new T.Shape();outline.moveTo(0,.83);outline.lineTo(.45,.38);outline.lineTo(.56,-.05);outline.quadraticCurveTo(.5,-.39,.31,-.48);outline.quadraticCurveTo(0,-.58,-.31,-.48);outline.quadraticCurveTo(-.5,-.39,-.56,-.05);outline.lineTo(-.45,.38);outline.closePath();
for(let row=0;row<3;row++){const y=.29-row*.17,w=.37-row*.045;for(const sign of [-1,1]){const hole=new T.Path();const x1=sign*.075,x2=sign*w;hole.moveTo(x1,y);hole.lineTo(x2,y+.07);hole.lineTo(x2,y+.13);hole.lineTo(x1,y+.06);hole.closePath();outline.holes.push(hole)}}
const visorGeo=new T.ExtrudeGeometry(outline,{depth:.045,bevelEnabled:true,bevelSegments:3,bevelSize:.018,bevelThickness:.018,curveSegments:20});const vp=visorGeo.attributes.position;
for(let i=0;i<vp.count;i++){const x=vp.getX(i),y=vp.getY(i);vp.setZ(i,vp.getZ(i)+.35-.57*Math.abs(x)+.045*y)}vp.needsUpdate=true;visorGeo.computeVertexNormals();mesh(visorGeo,edge,[0,-.005,.36],[1,1,1],head);
seam([[0,.82,.75],[0,.35,.76],[0,-.25,.73],[0,-.53,.68]],head,.018,silver);
for(const side of [-1,1]){const pivot=cyl([side*.567,-.22,.12],.132,.132,.07,dark,head);pivot.rotation.z=Math.PI/2;const bearing=cyl([side*.61,-.22,.12],.105,.105,.035,edge,head);bearing.rotation.z=Math.PI/2;
const emblem=new T.Group();emblem.position.set(side*.48,-.09,.44);emblem.rotation.y=side*.6;head.add(emblem);box([0,0,0],[.09,.025,.018],glow,emblem);box([0,0,0],[.026,.095,.018],glow,emblem);ball([0,0,.015],[.026,.027,.014],glow,emblem);}
decal('✦',[-.24,-.4,.47],.21,.16,'#24282b',head);
// Flexible waist with exposed mechanical struts.
for(let i=0;i<3;i++){cyl([0,-.26-i*.09,0],.52,.54,.075,dark);ring([0,-.26-i*.09,0],.52,.021)}
ball([0,-.66,0],[.65,.38,.38]);for(const s of [-1,1]){plate([[-.28,.25],[-.34,-.3],[.26,-.4],[.34,.22]],.075,[s*.36,-.63,.24]);}
// Arms: layered pauldrons, cuffs, mechanical hands with individually articulated fingers.
for(const side of [-1,1]){
const arm=new T.Group();arm.position.set(side*.91,1.38,0);arm.rotation.z=side*.055;root.add(arm);ball([0,0,0],[.36,.37,.32],dark,arm);
// Broad overlapping pauldrons with a swept upper crest, not stacked spheres.
const shoulder=shell([[0,-.4],[.37,-.39],[.49,-.22],[.54,.08],[.4,.34],[.18,.43],[0,.43]],[side*.09,-.04,0],[1,1,.93],silver,arm);shoulder.rotation.z=side*-.25;
for(let j=0;j<2;j++){const band=shell([[.39,-.07],[.43,-.06],[.48,.05],[.46,.11]],[side*.1,-.25-j*.14,0],[1,1,.95],j?edge:silver,arm);band.rotation.z=side*-.15;}
seam([[-.32,.15,.29],[-.18,.36,.36],[side*.1,.42,.32],[.38,.13,.28]],arm,.025);
for(let i=0;i<3;i++){rod([side*.22,-.21-i*.12,-.24],[-side*.2,-.35-i*.12,-.24],.018,dark,arm);}
rod([0,-.3,0],[side*.04,-.84,0],.19,dark,arm);shell([[.2,-.3],[.28,-.28],[.31,-.1],[.28,.22],[.22,.3]],[side*.04,-.62,0],[1,1,1],silver,arm);ring([side*.04,-.84,0],.24,.045,edge,arm);
ball([side*.04,-1.02,0],[.22,.22,.23],dark,arm);const elbow=ring([side*.04,-1.02,.18],.17,.035,edge,arm);elbow.rotation.x=0;
const fore=new T.Group();fore.position.set(side*.04,-1.11,0);fore.rotation.x=-.3;arm.add(fore);shell([[.22,-.38],[.3,-.34],[.34,-.1],[.32,.21],[.26,.33]],[0,-.33,0],[1,1,.95],silver,fore);
for(let j=0;j<3;j++)ring([0,-.12-j*.21,0],j===1?.335:.29,.025,edge,fore);
for(let j=0;j<2;j++){buckle([0,-.2-j*.25,.32],fore,1)}
ball([0,-.81,.02],[.23,.29,.13],silver,fore);for(let f=0;f<4;f++){let x=(f-1.5)*.105;ball([x,-1.04,.04],[.052,.07,.055],dark,fore);rod([x,-1.05,.04],[x,-1.23,.09],.048,silver,fore);ball([x,-1.23,.09],[.051,.052,.051],dark,fore);rod([x,-1.23,.09],[x,-1.34,.16],.043,edge,fore)}rod([side*.2,-.77,.05],[side*.31,-.97,.13],.075,silver,fore);rod([side*.31,-.97,.13],[side*.24,-1.1,.2],.06,edge,fore);
// Legs, greaves, knee shields and pointed armored boots.
const leg=new T.Group();leg.position.set(side*.37,-.72,0);leg.rotation.z=side*-.025;root.add(leg);ball([0,-.15,0],[.3,.3,.3],dark,leg);ball([0,-.57,0],[.39,.64,.38],silver,leg);ring([0,-.65,0],.335,.025,edge,leg);
ball([0,-1.14,0],[.28,.24,.28],dark,leg);plate([[-.25,.18],[0,.32],[.25,.18],[.31,-.06],[0,-.31],[-.31,-.06]],.08,[0,-1.14,.24],edge,leg);
for(let j=0;j<2;j++){plate([[-.29,.12],[0,.23],[.29,.12],[.31,-.1],[0,-.25],[-.31,-.1]],.04,[0,-.98-j*.21,.23]);}
shell([[.19,-.6],[.22,-.56],[.245,-.25],[.3,.2],[.32,.46],[.25,.54]],[0,-1.78,0],[1,1,1.12],silver,leg);rod([0,-1.34,.255],[0,-2.2,.19],.022,edge,leg);for(let j=0;j<2;j++){buckle([.12,-1.57-j*.38,.285],leg,.8)}
// Pointed sabatons lofted through elliptical cross sections.
const vertices=[],indices=[];const sections=[[-.26,.17,.18],[-.06,.25,.23],[.22,.27,.2],[.52,.235,.14],[.79,.15,.105],[1,.015,.045]];
for(const [z,w,h] of sections){for(let k=0;k<24;k++){const a=k/24*Math.PI*2;vertices.push(Math.cos(a)*w,-2.35+Math.sin(a)*h+Math.max(0,z-.5)*.12,z)}}
for(let i=0;i<sections.length-1;i++)for(let k=0;k<24;k++){let a=i*24+k,b=i*24+(k+1)%24,c=a+24,d=b+24;indices.push(a,b,c,b,d,c)}
const bootGeo=new T.BufferGeometry();bootGeo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));bootGeo.setIndex(indices);bootGeo.computeVertexNormals();mesh(bootGeo,silver,[0,0,0],[1,1,1],leg);
for(let j=0;j<4;j++){const z=.16+j*.13,w=.27-j*.018,h=.2-j*.025;const pts=[];for(let k=0;k<=16;k++){const a=k/16*Math.PI;pts.push([Math.cos(a)*w,-2.35+Math.sin(a)*h+.015,z])}seam(pts,leg,.013,edge)}
for(const sign of [-1,1]){const wing=plate([[0,0],[sign*.26,.24],[sign*.2,-.13],[0,-.2]],.035,[sign*.18,-1.1,.1],silver,leg);wing.rotation.y=sign*.5;}
seam([[-.13,-1.35,.27],[-.12,-1.75,.28],[-.08,-2.16,.2]],leg,.012);seam([[.13,-1.35,.27],[.12,-1.75,.28],[.08,-2.16,.2]],leg,.012);

}
// Rear ventilation follows the rounded cuirass; hidden design remains inferred.
for(let i=0;i<5;i++){const y=.65+i*.12;box([0,y,-.638],[.44,.027,.018],dark);}
root.userData={revision:3,description:'Approximate geometry reconstructed from supplied Mechanica Knight renders. Back and occluded details are inferred.'};return root;
}
