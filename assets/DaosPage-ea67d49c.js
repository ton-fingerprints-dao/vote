import{i as N,k as T,l as v,m as P,n as O,o as E,p as R,b as e,q as b,j as n,r as f,t as F,v as _,w as V,f as h,x as z,T as D,y as U,z as W,B as x,C,D as j,V as q,_ as o,G as B,I as L,J as G,K as Q,M as $,N as H,Q as J,R as K,U as X,W as Y,X as Z,Y as M,Z as ee,$ as se,a0 as te,a1 as A}from"./index-7a5adea9.js";import{L as ae}from"./List-e4234f64.js";import{P as re}from"./Page-e939ccea.js";const S=11,ne=N((s,t)=>({limit:S,loadMore:()=>s(a=>({limit:a.limit+S}))})),oe=s=>{let t=s.replace("https://","").replace("www.","");return o.last(t.split(""))==="/"&&(t=t.replace("/","")),t},ie=({dao:s})=>{var d;const[t,{entry:a}]=T(),l=a&&a.isIntersecting,{daoPage:i}=v(),r=(d=s.daoMetadata)==null?void 0:d.metadataArgs,m=P(),u=O(),p=s.daoRoles.owner===m||s.daoRoles.proposalOwner===m;if(r.hide&&!p)return null;const y=E.isMockDao(s.daoAddress)?"(mock)":"",w=R(r==null?void 0:r.name)||"";return e(b,{ref:t,onClick:()=>i.root(s.daoAddress),children:n(f,{className:"container",hover:!0,children:[r.hide&&e(F,{text:"Dao is hidden, you can change it in the settings page",children:e(_,{children:e(V,{style:{width:25,height:25},color:u.palette.primary.main})})}),l?n(h,{children:[e(z,{src:r==null?void 0:r.avatar}),e(D,{className:"title",children:e(U,{text:`${w}${y}`})}),e(de,{dao:s})]}):null,e(le,{dao:s})]})})},le=({dao:s})=>{const t=s.daoMetadata.metadataArgs.website;return W(s.daoAddress)&&t?e("button",{className:"website",onClick:a=>{a.stopPropagation(),window.open(t,"_blank")},children:e(x,{text:oe(t)})}):null},de=({dao:s})=>{var a;const t=(a=s.daoMetadata)==null?void 0:a.metadataArgs;return n(C,{className:"address",children:[t.dns?e(x,{className:"address-value",text:t.dns}):e(D,{className:"address-value",children:j(s.daoAddress,6)}),e(q,{daoAddress:s.daoAddress})]})},ce=(s,t)=>{if(!t)return s;const a=o.filter(s,i=>i.daoMetadata.metadataArgs.name.toLowerCase().includes(t.toLowerCase())),l=o.filter(s,i=>i.daoAddress.toLowerCase().includes(t.toLowerCase()));return o.uniqBy([...a,...l],"daoAddress")};function we(){const{data:s=[],isLoading:t,dataUpdatedAt:a}=B(),{limit:l,loadMore:i}=ne(),[r,m]=L.useState(""),u=G(),{query:p,setSearch:y}=Q(),w=c=>{m(c),y(c)},d=$(),g=L.useMemo(()=>ce(s,r),[r,a]),k=!t&&!o.size(g);return e(re,{hideBack:!0,children:n(h,{alignItems:"flex-start",gap:u?15:24,children:[n(H,{children:[e(J,{initialValue:p.search||"",onChange:w,placeholder:d.searchForDAO}),n(K,{children:[X(o.size(s))," ",d.spaces]})]}),n(h,{gap:25,children:[e(ae,{isLoading:t,isEmpty:!!k,loader:e(me,{}),emptyComponent:e(Y,{children:e(C,{children:e(Z,{children:d.noSpaces})})}),children:n(M,{children:[g.map((c,I)=>I>l?null:e(ie,{dao:c},c.daoAddress)),e(he,{})]})}),e(ee,{totalItems:o.size(g),amountToShow:l,showMore:i,limit:S})]})]})})}const he=()=>e(se,{onClick:()=>window.open(te,"_blank"),children:e(f,{hover:!0,className:"container",children:e(h,{className:"flex",children:e(D,{children:"Create a new space for your DAO"})})})}),me=()=>e(M,{children:o.range(0,1).map((s,t)=>e(b,{children:e(f,{children:n(h,{children:[e(A,{style:{borderRadius:"50%",width:70,height:70}}),e(A,{style:{width:"70%"}}),e(A,{})]})})},t))});export{we as DaosPage,we as default};