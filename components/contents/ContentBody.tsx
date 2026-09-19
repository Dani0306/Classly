import { Content } from "@/types";
import { getFileUrl } from "@/utils/fn";
import { ContentTextEditor } from "@/hooks/contents/useContentText";
import DiagramPreview from "./DiagramPreview";
import FilePreview from "./FilePreview";
import TextToEdit from "./TextToEdit";

const ContentBody = ({
  content,
  editor,
}: {
  content: Content;
  editor: ContentTextEditor;
}) => {
  const type = content.type;
  const fileUrl = getFileUrl(content);

  if (type === "diagram" && content.ai_output)
    return <DiagramPreview url={content.ai_output} title={content.title} />;

  if (type === "file" && fileUrl)
    return <FilePreview url={fileUrl} title={content.title} />;

  return (
    <TextToEdit
      isEditingText={editor.isEditing}
      setIsEditingText={editor.setIsEditing}
      originalText={editor.savedText}
      textValue={editor.textValue}
      setTextValue={editor.setTextValue}
      updateText={editor.save}
    />
  );
};

export default ContentBody;
