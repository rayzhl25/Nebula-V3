
import React, { useState } from 'react';
import { 
  Save, Play, Plus, Trash2, Tag, 
  BookOpen, FileText, Settings, ArrowRight,
  Bold, Italic, Underline, List, Link as LinkIcon, X
} from 'lucide-react';
import { saveApiConfig } from '../../../services/mockService';

interface ApiEditorProps {
  file: any;
  lang?: 'zh' | 'en';
}

const ApiEditor: React.FC<ApiEditorProps> = ({ file, lang = 'zh' }) => {
  const [activeTab, setActiveTab] = useState<'design' | 'doc' | 'test'>('design');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
      name: file?.title || 'New Interface',
      method: 'GET',
      path: '/api/v1/resource',
      tags: ['User', 'Auth'],
      newTag: '',
      description: 'Fetch user details by ID.',
      usageDoc: '### Usage\nCall this endpoint with a valid Bearer token.',
      params: [
          { id: '1', key: 'id', type: 'Integer', required: true, desc: 'User ID' }
      ],
      headers: [
          { id: 'h1', key: 'Authorization', value: 'Bearer {{token}}', desc: 'Auth Token' }
      ],
      responseBody: '{\n  "code": 200,\n  "data": { ... },\n  "msg": "Success"\n}'
  });

  const texts = {
      zh: {
          save: '保存',
          test: '测试',
          design: '接口设计',
          doc: '使用说明',
          testTab: '在线调试',
          basicInfo: '基础信息',
          name: '接口名称',
          method: '请求方法',
          path: '请求路径',
          tags: '接口标签',
          desc: '接口说明',
          addTag: '添加',
          reqParams: '请求参数',
          reqHeaders: '请求头',
          resDef: '响应定义',
          paramKey: '参数名',
          paramType: '类型',
          paramReq: '必填',
          paramDesc: '说明',
          headerKey: 'Header名',
          headerVal: '示例值',
          addParam: '添加参数',
          addHeader: '添加Header',
          saving: '保存中...'
      },
      en: {
          save: 'Save',
          test: 'Test',
          design: 'Design',
          doc: 'Documentation',
          testTab: 'Debug',
          basicInfo: 'Basic Info',
          name: 'Name',
          method: 'Method',
          path: 'Path',
          tags: 'Tags',
          desc: 'Description',
          addTag: 'Add',
          reqParams: 'Request Params',
          reqHeaders: 'Request Headers',
          resDef: 'Response Definition',
          paramKey: 'Key',
          paramType: 'Type',
          paramReq: 'Required',
          paramDesc: 'Description',
          headerKey: 'Header',
          headerVal: 'Value',
          addParam: 'Add Param',
          addHeader: 'Add Header',
          saving: 'Saving...'
      }
  };

  const t = texts[lang];

  const handleSave = async () => {
      setLoading(true);
      try {
          await saveApiConfig(formData);
          alert(lang === 'zh' ? '保存成功' : 'Saved successfully');
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const addTag = () => {
      if (formData.newTag.trim()) {
          setFormData(prev => ({ ...prev, tags: [...prev.tags, prev.newTag.trim()], newTag: '' }));
      }
  };

  const removeTag = (tag: string) => {
      setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 text-sm">
      {/* Toolbar */}
      <div className="h-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 flex-shrink-0">
         <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                formData.method === 'GET' ? 'bg-green-500' : 
                formData.method === 'POST' ? 'bg-blue-500' : 
                formData.method === 'DELETE' ? 'bg-red-500' : 'bg-orange-500'
            }`}>
                {formData.method}
            </span>
            <span className="font-bold text-gray-700 dark:text-gray-200">{formData.name}</span>
         </div>
         <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-xs font-medium transition-colors">
                <Play size={14} /> {t.test}
            </button>
            <button 
                onClick={handleSave} 
                disabled={loading}
                className="flex items-center gap-1 px-3 py-1.5 bg-nebula-600 text-white rounded hover:bg-nebula-700 text-xs font-medium transition-colors disabled:opacity-50"
            >
                <Save size={14} /> {loading ? t.saving : t.save}
            </button>
         </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex gap-6">
          {[
              { id: 'design', label: t.design, icon: Settings },
              { id: 'doc', label: t.doc, icon: BookOpen },
              { id: 'test', label: t.testTab, icon: Play },
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                    activeTab === tab.id 
                    ? 'border-nebula-600 text-nebula-600 dark:text-nebula-400 font-medium' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                  <tab.icon size={16} />
                  {tab.label}
              </button>
          ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'design' && (
              <div className="max-w-5xl mx-auto space-y-6">
                  {/* Basic Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
                      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-gray-700 pb-2">{t.basicInfo}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.name}</label>
                              <input 
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:border-nebula-500 text-sm"
                              />
                          </div>
                          <div className="flex gap-4">
                              <div className="w-1/3">
                                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.method}</label>
                                  <div className="relative">
                                      <select 
                                        value={formData.method}
                                        onChange={e => setFormData({...formData, method: e.target.value})}
                                        className="w-full appearance-none px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:border-nebula-500 text-sm"
                                      >
                                          <option value="GET">GET</option>
                                          <option value="POST">POST</option>
                                          <option value="PUT">PUT</option>
                                          <option value="DELETE">DELETE</option>
                                          <option value="PATCH">PATCH</option>
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                      </div>
                                  </div>
                              </div>
                              <div className="flex-1">
                                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.path}</label>
                                  <input 
                                    type="text" 
                                    value={formData.path}
                                    onChange={e => setFormData({...formData, path: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:border-nebula-500 text-sm font-mono"
                                  />
                              </div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t.tags}</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                              {formData.tags.map(tag => (
                                  <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                                      <Tag size={10} /> {tag}
                                      <button onClick={() => removeTag(tag)} className="hover:text-red-500 ml-1"><X size={10} /></button>
                                  </span>
                              ))}
                              <div className="flex items-center gap-1">
                                  <input 
                                    type="text" 
                                    value={formData.newTag}
                                    onChange={e => setFormData({...formData, newTag: e.target.value})}
                                    onKeyDown={e => e.key === 'Enter' && addTag()}
                                    placeholder={t.addTag}
                                    className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-transparent outline-none w-20 focus:w-32 transition-all text-gray-800 dark:text-white"
                                  />
                                  <button onClick={addTag} className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 text-gray-600 dark:text-gray-300"><Plus size={12} /></button>
                              </div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{t.desc}</label>
                          <textarea 
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:border-nebula-500 outline-none text-sm resize-none"
                          />
                      </div>
                  </div>

                  {/* Request Params */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">{t.reqParams}</h3>
                          <button className="text-xs flex items-center gap-1 text-nebula-600 hover:underline">
                              <Plus size={12} /> {t.addParam}
                          </button>
                      </div>
                      <table className="w-full text-left text-xs">
                          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase">
                              <tr>
                                  <th className="p-3 w-1/4">{t.paramKey}</th>
                                  <th className="p-3 w-1/6">{t.paramType}</th>
                                  <th className="p-3 w-16 text-center">{t.paramReq}</th>
                                  <th className="p-3">{t.paramDesc}</th>
                                  <th className="p-3 w-10"></th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                              {formData.params.map(param => (
                                  <tr key={param.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                      <td className="p-2"><input type="text" defaultValue={param.key} className="w-full bg-transparent outline-none" /></td>
                                      <td className="p-2">
                                          <select defaultValue={param.type} className="bg-transparent outline-none text-blue-600 dark:text-blue-400">
                                              <option>String</option><option>Integer</option><option>Boolean</option>
                                          </select>
                                      </td>
                                      <td className="p-2 text-center"><input type="checkbox" defaultChecked={param.required} /></td>
                                      <td className="p-2"><input type="text" defaultValue={param.desc} className="w-full bg-transparent outline-none text-gray-500" /></td>
                                      <td className="p-2 text-center text-red-500 cursor-pointer hover:bg-red-50 rounded"><Trash2 size={14} /></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>

                  {/* Headers */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">{t.reqHeaders}</h3>
                          <button className="text-xs flex items-center gap-1 text-nebula-600 hover:underline">
                              <Plus size={12} /> {t.addHeader}
                          </button>
                      </div>
                      <table className="w-full text-left text-xs">
                          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 uppercase">
                              <tr>
                                  <th className="p-3 w-1/3">{t.headerKey}</th>
                                  <th className="p-3 w-1/3">{t.headerVal}</th>
                                  <th className="p-3">{t.paramDesc}</th>
                                  <th className="p-3 w-10"></th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                              {formData.headers.map(h => (
                                  <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                      <td className="p-2"><input type="text" defaultValue={h.key} className="w-full bg-transparent outline-none font-bold" /></td>
                                      <td className="p-2"><input type="text" defaultValue={h.value} className="w-full bg-transparent outline-none font-mono text-gray-500" /></td>
                                      <td className="p-2"><input type="text" defaultValue={h.desc} className="w-full bg-transparent outline-none text-gray-500" /></td>
                                      <td className="p-2 text-center text-red-500 cursor-pointer hover:bg-red-50 rounded"><Trash2 size={14} /></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>

                  {/* Response Body */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">{t.resDef} (JSON)</h3>
                      <textarea 
                        value={formData.responseBody}
                        onChange={e => setFormData({...formData, responseBody: e.target.value})}
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white font-mono text-xs outline-none focus:border-nebula-500"
                      />
                  </div>
              </div>
          )}

          {activeTab === 'doc' && (
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                  <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                        <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><Bold size={16} /></button>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><Italic size={16} /></button>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><Underline size={16} /></button>
                        <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><List size={16} /></button>
                        <button className="p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><LinkIcon size={16} /></button>
                  </div>
                  <textarea 
                    value={formData.usageDoc}
                    onChange={e => setFormData({...formData, usageDoc: e.target.value})}
                    className="flex-1 w-full p-4 bg-transparent outline-none resize-none text-gray-800 dark:text-white font-mono text-sm"
                    placeholder="Enter usage documentation..."
                  />
              </div>
          )}

          {activeTab === 'test' && (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Play size={48} className="mb-4 opacity-20" />
                  <p>Debug feature would simulate requests here.</p>
              </div>
          )}
      </div>
    </div>
  );
};

export default ApiEditor;
