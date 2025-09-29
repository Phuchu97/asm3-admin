import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import '../css/rich-text-editor.css';

const RichTextEditor = ({ value, onChange, placeholder, error, disabled = false }) => {
  const editorRef = useRef(null);

  const handleEditorChange = (content) => {
    onChange(content);
  };

  return (
    <div style={{
      border: error ? '2px solid #d32f2f' : (value ? '2px solid #4caf50' : '1px solid #ccc'),
      borderRadius: '4px',
      backgroundColor: error ? '#ffebee' : (value ? '#e8f5e8' : 'white')
    }}>
      <Editor
        tinymceScriptSrc="/tinymce/js/tinymce/tinymce.min.js"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          license_key: "gpl", 
          height: 400,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
            'nonbreaking', 'pagebreak', 'directionality'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | table | image | link | ' +
            'forecolor backcolor | fontsize | fontfamily | ' +
            'searchreplace | visualblocks | code | fullscreen | ' +
            'insertdatetime | media | pagebreak | ' +
            'directionality',
          content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
          placeholder: placeholder,
          disabled: disabled,
          table_toolbar: 'tableprops tabledelete | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol',
          table_appearance_options: true,
          table_clone_elements: 'strong em b i span font h1 h2 h3 h4 h5 h6 p div',
          table_cell_advtab: true,
          table_cell_class_list: [
            { title: 'None', value: '' },
            { title: 'Header', value: 'header' },
            { title: 'Highlight', value: 'highlight' }
          ],
          table_row_class_list: [
            { title: 'None', value: '' },
            { title: 'Header', value: 'header' },
            { title: 'Highlight', value: 'highlight' }
          ],
          table_default_attributes: {
            border: '1'
          },
          table_default_styles: {
            'border-collapse': 'collapse',
            'width': '100%'
          },
          table_responsive_width: true,
          table_use_colgroups: true,
          table_cell_advtab: true,
          table_row_advtab: true,
          table_advtab: true,
          table_style_by_css: true,
          table_grid: true,
          table_tab_navigation: true,
          branding: false,
          promotion: false,
          statusbar: true,
          resize: true,
          elementpath: true,
          contextmenu: 'link image imagetools table spellchecker configurepermanentpen'
        }}
      />
    </div>
  );
};

export default RichTextEditor;