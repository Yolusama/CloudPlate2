import { Route } from "../../moudles/Route";

export function InternalServerError() {
  return (
    <div style={{marginTop:"20%"}} onClick={()=>Route.back()} className="no-drag">
      <h1>500 - Internal Server Error</h1>
      <p>后台系统出现问题</p>
      <p>点击页面内容返回</p>
    </div>
  );
}
