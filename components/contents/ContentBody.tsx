import { Content } from "@/types";
import { ContentTextEditor } from "@/hooks/contents/useContentText";
import DiagramPreview from "./DiagramPreview";
import TextToEdit from "./TextToEdit";

const ContentBody = ({
  content,
  editor,
}: {
  content: Content;
  editor: ContentTextEditor;
}) => {
  const type = content.type;

  if (type === "diagram" && content.ai_output)
    return <DiagramPreview url={content.ai_output} title={content.title} />;

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
