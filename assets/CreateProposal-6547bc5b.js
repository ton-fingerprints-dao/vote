import{i as l,aa as P,u as g,a as D,l as f,ab as L,ac as S,b as e}from"./index-7a5adea9.js";import{L as b}from"./components-816c0cf6.js";import{P as C,p as F}from"./ProposalForm-ec8f003b.js";import"./index.esm-87920604.js";const A=l(P(o=>({formData:{},setFormData:a=>o({formData:a})}),{name:"ton-vote-create-proposal"})),h=()=>{const{daoAddress:o}=g(),{data:a,isLoading:r}=D(o),{setFormData:t,formData:i}=A(),p=f(),{mutate:n,isLoading:m}=L(),{addProposal:d}=S();return e(b,{title:"Create proposal",isLoading:r,children:e(C,{submitText:"Create",initialFormData:i,persistForm:t,onSubmit:c=>{const u=F(c);n({metadata:u,onSuccess:s=>{p.proposalPage.root(a.daoAddress,s),t({}),d(a.daoAddress,s)}})},isLoading:m,dao:a})})};export{h as CreateProposal,h as default};