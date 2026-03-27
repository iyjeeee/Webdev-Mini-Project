// ============================================================
// RichTextEditor.jsx — Lightweight rich-text editor toolbar
// ============================================================
import React, { useRef, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Link,
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  // Sync external value to DOM only on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = useCallback((command, arg = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    handleInput();
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleLink = useCallback(() => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) exec('createLink', url);
  }, [exec]);

  const isActive = (command) => {
    try { return document.queryCommandState(command); } catch { return false; }
  };

  const ToolBtn = ({ cmd, icon: Icon, title, onClick }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick ? onClick() : exec(cmd);
      }}
      className={`p-1.5 rounded hover:bg-gray-200 transition-colors cursor-pointer ${isActive(cmd) ? 'bg-yellow-200' : ''}`}
    >
      <Icon size={14} className="text-gray-700" />
    </button>
  );

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-gray-50 border-b border-gray-200">
        <ToolBtn cmd="bold"          icon={Bold}         title="Bold (Ctrl+B)" />
        <ToolBtn cmd="italic"        icon={Italic}       title="Italic (Ctrl+I)" />
        <ToolBtn cmd="underline"     icon={Underline}    title="Underline (Ctrl+U)" />
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolBtn cmd="insertUnorderedList" icon={List}         title="Bullet List" />
        <ToolBtn cmd="insertOrderedList"   icon={ListOrdered}  title="Numbered List" />
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolBtn cmd="justifyLeft"   icon={AlignLeft}    title="Align Left" />
        <ToolBtn cmd="justifyCenter" icon={AlignCenter}  title="Align Center" />
        <ToolBtn cmd="justifyRight"  icon={AlignRight}   title="Align Right" />
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolBtn icon={Link} title="Insert Link" onClick={handleLink} />
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder || 'Write task description here...'}
        className="min-h-[140px] p-3 text-sm text-gray-800 outline-none leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
      />
    </div>
  );
};

export default RichTextEditor;
