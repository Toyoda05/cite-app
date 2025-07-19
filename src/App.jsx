import React, { useState } from 'react';
import { ChevronLeft, Plus, BookOpen, FileText, Tag, X, Edit2 } from 'lucide-react';

const CitationManager = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'detail'
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [papers, setPapers] = useState([
    {
      id: 1,
      title: "機械学習における深層学習の応用",
      author: "田中太郎",
      year: 2023,
      journal: "情報処理学会論文誌",
      memos: []
    },
    {
      id: 2,
      title: "自然言語処理の最新動向",
      author: "佐藤花子",
      year: 2024,
      journal: "人工知能学会誌",
      memos: []
    }
  ]);
  
  const [globalTags, setGlobalTags] = useState(['重要', '実験', '理論', '応用']);
  const [showAddPaper, setShowAddPaper] = useState(false);
  const [showAddMemo, setShowAddMemo] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: '',
    author: '',
    year: '',
    journal: ''
  });

  const [newMemo, setNewMemo] = useState({
    type: 'quote', // 'quote' or 'summary'
    content: '',
    localTags: [],
    globalTags: [],
    newLocalTag: '',
    newGlobalTag: ''
  });

  const addPaper = () => {
    if (newPaper.title && newPaper.author) {
      const paper = {
        id: Date.now(),
        ...newPaper,
        year: parseInt(newPaper.year) || new Date().getFullYear(),
        memos: []
      };
      setPapers([...papers, paper]);
      setNewPaper({ title: '', author: '', year: '', journal: '' });
      setShowAddPaper(false);
    }
  };

  const addMemo = () => {
    if (newMemo.content) {
      const memo = {
        id: Date.now(),
        ...newMemo,
        createdAt: new Date().toLocaleString('ja-JP')
      };
      
      const updatedPapers = papers.map(paper => 
        paper.id === selectedPaper.id 
          ? { ...paper, memos: [...paper.memos, memo] }
          : paper
      );
      
      setPapers(updatedPapers);
      setSelectedPaper({ ...selectedPaper, memos: [...selectedPaper.memos, memo] });
      
      // Add new global tags to the global tags list
      newMemo.globalTags.forEach(tag => {
        if (!globalTags.includes(tag)) {
          setGlobalTags([...globalTags, tag]);
        }
      });
      
      setNewMemo({
        type: 'quote',
        content: '',
        localTags: [],
        globalTags: [],
        newLocalTag: '',
        newGlobalTag: ''
      });
      setShowAddMemo(false);
    }
  };

  const addLocalTag = () => {
    if (newMemo.newLocalTag && !newMemo.localTags.includes(newMemo.newLocalTag)) {
      setNewMemo({
        ...newMemo,
        localTags: [...newMemo.localTags, newMemo.newLocalTag],
        newLocalTag: ''
      });
    }
  };

  const addGlobalTag = () => {
    if (newMemo.newGlobalTag && !newMemo.globalTags.includes(newMemo.newGlobalTag)) {
      setNewMemo({
        ...newMemo,
        globalTags: [...newMemo.globalTags, newMemo.newGlobalTag],
        newGlobalTag: ''
      });
    }
  };

  const removeLocalTag = (tagToRemove) => {
    setNewMemo({
      ...newMemo,
      localTags: newMemo.localTags.filter(tag => tag !== tagToRemove)
    });
  };

  const removeGlobalTag = (tagToRemove) => {
    setNewMemo({
      ...newMemo,
      globalTags: newMemo.globalTags.filter(tag => tag !== tagToRemove)
    });
  };

  const selectGlobalTag = (tag) => {
    if (!newMemo.globalTags.includes(tag)) {
      setNewMemo({
        ...newMemo,
        globalTags: [...newMemo.globalTags, tag]
      });
    }
  };

  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">引用文献管理</h1>
            <button
              onClick={() => setShowAddPaper(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              文献追加
            </button>
          </div>

          <div className="grid gap-4">
            {papers.map(paper => (
              <div key={paper.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                   onClick={() => {
                     setSelectedPaper(paper);
                     setCurrentView('detail');
                   }}>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{paper.title}</h3>
                <p className="text-gray-600 mb-1">{paper.author} ({paper.year})</p>
                <p className="text-gray-500 text-sm mb-3">{paper.journal}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    メモ数: {paper.memos.length}
                  </span>
                  <ChevronLeft className="transform rotate-180 text-gray-400" size={20} />
                </div>
              </div>
            ))}
          </div>

          {showAddPaper && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4">新しい文献を追加</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="論文タイトル"
                    value={newPaper.title}
                    onChange={(e) => setNewPaper({...newPaper, title: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="著者名"
                    value={newPaper.author}
                    onChange={(e) => setNewPaper({...newPaper, author: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="発表年"
                    value={newPaper.year}
                    onChange={(e) => setNewPaper({...newPaper, year: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="雑誌・会議名"
                    value={newPaper.journal}
                    onChange={(e) => setNewPaper({...newPaper, journal: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={addPaper}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    追加
                  </button>
                  <button
                    onClick={() => {
                      setShowAddPaper(false);
                      setNewPaper({ title: '', author: '', year: '', journal: '' });
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentView('list')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-semibold">{selectedPaper?.title}</h1>
              <p className="text-sm text-gray-600">{selectedPaper?.author} ({selectedPaper?.year})</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-medium">メモ一覧</h2>
          <button
            onClick={() => setShowAddMemo(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            メモ追加
          </button>
        </div>

        <div className="space-y-4">
          {selectedPaper?.memos.map(memo => (
            <div key={memo.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-2 mb-3">
                {memo.type === 'quote' ? (
                  <div className="flex items-center gap-2 text-blue-600">
                    <FileText size={16} />
                    <span className="text-sm font-medium">引用</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-purple-600">
                    <BookOpen size={16} />
                    <span className="text-sm font-medium">要約</span>
                  </div>
                )}
                <span className="text-xs text-gray-500 ml-auto">{memo.createdAt}</span>
              </div>
              
              <div className="bg-gray-50 rounded p-4 mb-4">
                <p className="text-gray-800 whitespace-pre-wrap">{memo.content}</p>
              </div>

              <div className="space-y-2">
                {memo.localTags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-orange-500" />
                    <span className="text-xs text-gray-600">ローカル:</span>
                    <div className="flex gap-1 flex-wrap">
                      {memo.localTags.map(tag => (
                        <span key={tag} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {memo.globalTags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag size={14} className="text-blue-500" />
                    <span className="text-xs text-gray-600">グローバル:</span>
                    <div className="flex gap-1 flex-wrap">
                      {memo.globalTags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {selectedPaper?.memos.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              まだメモがありません。メモを追加してみてください。
            </div>
          )}
        </div>

        {showAddMemo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">新しいメモを追加</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">メモタイプ</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="quote"
                      checked={newMemo.type === 'quote'}
                      onChange={(e) => setNewMemo({...newMemo, type: e.target.value})}
                      className="mr-2"
                    />
                    <FileText size={16} className="mr-1 text-blue-600" />
                    引用モード
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="summary"
                      checked={newMemo.type === 'summary'}
                      onChange={(e) => setNewMemo({...newMemo, type: e.target.value})}
                      className="mr-2"
                    />
                    <BookOpen size={16} className="mr-1 text-purple-600" />
                    要約モード
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {newMemo.type === 'quote' ? '引用内容' : '要約内容'}
                </label>
                <textarea
                  value={newMemo.content}
                  onChange={(e) => setNewMemo({...newMemo, content: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-vertical"
                  placeholder={newMemo.type === 'quote' ? '直接引用した内容を入力してください...' : '要約した内容を入力してください...'}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">ローカルタグ（この文献のみ）</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newMemo.newLocalTag}
                    onChange={(e) => setNewMemo({...newMemo, newLocalTag: e.target.value})}
                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="新しいローカルタグ"
                    onKeyPress={(e) => e.key === 'Enter' && addLocalTag()}
                  />
                  <button
                    onClick={addLocalTag}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    追加
                  </button>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {newMemo.localTags.map(tag => (
                    <span key={tag} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeLocalTag(tag)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">グローバルタグ（全体共有）</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newMemo.newGlobalTag}
                    onChange={(e) => setNewMemo({...newMemo, newGlobalTag: e.target.value})}
                    className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="新しいグローバルタグ"
                    onKeyPress={(e) => e.key === 'Enter' && addGlobalTag()}
                  />
                  <button
                    onClick={addGlobalTag}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    追加
                  </button>
                </div>
                
                <div className="mb-2">
                  <p className="text-xs text-gray-600 mb-1">既存のグローバルタグから選択:</p>
                  <div className="flex gap-1 flex-wrap">
                    {globalTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => selectGlobalTag(tag)}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          newMemo.globalTags.includes(tag)
                            ? 'bg-blue-200 text-blue-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-1 flex-wrap">
                  {newMemo.globalTags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeGlobalTag(tag)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={addMemo}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  メモ追加
                </button>
                <button
                  onClick={() => {
                    setShowAddMemo(false);
                    setNewMemo({
                      type: 'quote',
                      content: '',
                      localTags: [],
                      globalTags: [],
                      newLocalTag: '',
                      newGlobalTag: ''
                    });
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CitationManager;