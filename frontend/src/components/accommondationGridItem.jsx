import * as React from "react";

export default function AccommondationGridItem({ data, ...props }) {
  return (
    <div className={data.neperziureti_ispejimai > 0 ? 'warning-active' : ''} style={{padding: 12, borderWidth:1, borderStyle:"solid", borderColor:"#bbb", minHeight:300, minWidth:300}} {...props}>
      <p>{data.pavadinimas}</p>
    </div>
  );
}