import type { ReactNode } from 'react';
export function Badge({children,tone='neutral',dot=false}:{children:ReactNode;tone?:'neutral'|'success'|'warning'|'danger'|'accent';dot?:boolean}){return <span className={`ui-badge badge-${tone}`}>{dot&&<i/>}{children}</span>;}
