import { forwardRef, useId, type ButtonHTMLAttributes } from 'react';
import { LoaderCircle } from 'lucide-react';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{variant?:'default'|'secondary'|'ghost'|'destructive';size?:'sm'|'default'|'icon';loading?:boolean;progress?:number;loadingLabel?:string}
export const Button=forwardRef<HTMLButtonElement,ButtonProps>(function Button({variant='secondary',size='default',loading=false,progress,loadingLabel,disabled,className='',children,type='button',...props},ref){
  const labelId=useId();
  const percent=typeof progress==='number'&&Number.isFinite(progress)?Math.round(Math.min(100,Math.max(0,progress))):undefined;
  const busy=loading||percent!==undefined;
  return <button ref={ref} type={type} data-slot="button" data-variant={variant} data-size={size} {...props} aria-labelledby={props['aria-labelledby']??(props['aria-label']?undefined:labelId)} aria-busy={busy||undefined} disabled={disabled||busy} className={`ui-button ${className}`}>
    {busy&&<span className="ui-button-progress" role="progressbar" aria-label={loadingLabel??'Aktion läuft'} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
      {percent===undefined?<LoaderCircle size={13} className="spin" aria-hidden="true"/>:<svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><circle className="progress-track" cx="8" cy="8" r="6"/><circle className="progress-value" cx="8" cy="8" r="6" pathLength="100" strokeDasharray="100" strokeDashoffset={100-percent}/></svg>}
    </span>}
    <span id={labelId} className="ui-button-content">{busy&&loadingLabel?loadingLabel:children}</span>{percent!==undefined&&size!=='icon'&&<span className="ui-button-percent" aria-hidden="true">{percent}%</span>}
  </button>;
});
