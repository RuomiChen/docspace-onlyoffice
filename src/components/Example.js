import { DocumentEditor } from "@onlyoffice/document-editor-react";
import { useRef } from "react";

export default function App() {
  const editorRef = useRef<any>(null);

  const onAppReady = () => {
    console.log("✅ DocumentEditor Ready");

    // 拿到 iframe DOM（实际运行编辑器的容器）
    const iframe = document.getElementById("onlyoffice-editor") 
    editorRef.current = iframe;
  };

  // 手动调用插件高亮
  const highlightKeyword = (keyword) => {
    if (!editorRef.current) return;

    const pluginMessage = {
      type: "highlight",
      text: keyword,
    };

    // 发送消息给 ONLYOFFICE 插件
    editorRef.current.contentWindow?.postMessage(
      {
        frameEditorId: "onlyoffice-editor",
        data: pluginMessage,
        pluginGuid: "highlight-select", // 插件ID，可随意但需与插件注册一致
        type: "onExternalMessage",
      },
      "*"
    );
  };

  return (
    <div style={{ height: "100vh" }}>
      <button
        onClick={() => highlightKeyword("ONLYOFFICE")}
        style={{ position: "absolute", zIndex: 10, top: 10, left: 10 }}
      >
        高亮 “ONLYOFFICE”
      </button>

      <DocumentEditor
        id="onlyoffice-editor"
        documentServerUrl="https://your-onlyoffice-server.com/"
        config={{
          document: {
            fileType: "docx",
            key: "example-001",
            title: "example.docx",
            url: "https://your-storage.com/example.docx",
          },
          editorConfig: {
            mode: "edit",
            lang: "zh-CN",
            plugins: {
              autostart: [
                "http://localhost:3000/plugins/highlight-select/plugin.js",
              ],
            },
          },
        }}
        events={{
          onAppReady,
        }}
      />
    </div>
  );
}
