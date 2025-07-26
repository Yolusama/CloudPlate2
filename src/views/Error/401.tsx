import { Route } from "../../moudles/Route";

export function Unauthorized() {
    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }} onClick={()=>Route.back()} className="no-drag">
            <h1>401 - 未经授权</h1>
            <p>抱歉，您没有访问此页面的权限。</p>
            <p>点击页面内容返回</p>
        </div>
    );
}