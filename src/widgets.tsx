import {useId,type ReactNode} from 'react';
export function Panel({title,description,children}:{title:string;description?:string;children:ReactNode}){
 const id=useId();return <section className="renzu-panel" aria-labelledby={id}><header><h2 id={id}>{title}</h2>{description&&<p>{description}</p>}</header>{children}</section>;
}
export function MetricCard({label,value,note}:{label:string;value:string|number;note?:string}){
 return <div className="renzu-metric"><span>{label}</span><strong>{value}</strong>{note&&<small>{note}</small>}</div>;
}
export interface ResourceRow {name:string;namespace:string;kind:string;createdAt?:string}
export function ResourceTable({rows,caption='Ressourcen',emptyLabel='Keine Ressourcen',onSelect}:{rows:readonly ResourceRow[];caption?:string;emptyLabel?:string;onSelect?:(row:ResourceRow)=>void}){
 return <div className="renzu-table-scroll"><table className="renzu-table"><caption>{caption}</caption><thead><tr><th scope="col">Name</th><th scope="col">Namespace</th><th scope="col">Typ</th></tr></thead><tbody>{rows.map((row,index)=><tr key={`${row.namespace}:${row.name}:${index}`}><td>{onSelect?<button className="renzu-resource-link" onClick={()=>onSelect(row)}>{row.name}</button>:row.name}</td><td>{row.namespace||'—'}</td><td>{row.kind}</td></tr>)}{!rows.length&&<tr><td colSpan={3}>{emptyLabel}</td></tr>}</tbody></table></div>;
}
