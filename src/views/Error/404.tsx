import { Route } from "../../moudles/Route";

export function NotFound() {
    return (
        <div style={{ textAlign: 'center', marginTop: '20%' }} onClick={()=>Route.back()} className="no-drag">
            <h1>404 - 页面未找到</h1>
            <p>抱歉，您访问的页面不存在。</p>
            <p>点击页面返回</p>
        </div>
    );
}