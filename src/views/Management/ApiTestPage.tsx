import { useState, useEffect } from 'react';
import { apiClient } from '@/services';
import {
  authService,
  aiChatService,
  chatboxService,
  lmsService,
  cmsService,
  notificationService,
  thesisService,
  thesisGroupsService,
  thesisRoundsService,
} from '@/services';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
}

export default function ApiTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [gatewayStatus, setGatewayStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  const addResult = (name: string, status: 'success' | 'error', data?: any, error?: string) => {
    setResults(prev => [...prev, { name, status, data, error }]);
  };

  useEffect(() => {
    const checkGateway = async () => {
      try {
        await apiClient.healthCheck();
        setGatewayStatus('online');
      } catch (error) {
        setGatewayStatus('offline');
      }
    };
    checkGateway();
  }, []);

  const testAuthMe = async () => {
    try {
      const data = await authService.getMe();
      addResult('GET /api/auth/me', 'success', data);
    } catch (error: any) {
      addResult('GET /api/auth/me', 'error', null, error.message);
    }
  };

  const testAIChatSendMessage = async () => {
    try {
      const data = await aiChatService.sendMessage('Hello, this is a test message');
      addResult('POST /api/chat/message', 'success', data);
    } catch (error: any) {
      addResult('POST /api/chat/message', 'error', null, error.message);
    }
  };

  const testChatboxGetMessages = async () => {
    try {
      const data = await chatboxService.getMessages();
      addResult('GET /api/chatbox/messages', 'success', data);
    } catch (error: any) {
      addResult('GET /api/chatbox/messages', 'error', null, error.message);
    }
  };

  const testChatboxGetConversations = async () => {
    try {
      const data = await chatboxService.getConversations();
      addResult('GET /api/chatbox/conversations', 'success', data);
    } catch (error: any) {
      addResult('GET /api/chatbox/conversations', 'error', null, error.message);
    }
  };

  const testLMSGetCourses = async () => {
    try {
      const data = await lmsService.getCourses();
      addResult('GET /api/courses', 'success', data);
    } catch (error: any) {
      addResult('GET /api/courses', 'error', null, error.message);
    }
  };

  const testCMSGetContent = async () => {
    try {
      const data = await cmsService.getContent();
      addResult('GET /api/content', 'success', data);
    } catch (error: any) {
      addResult('GET /api/content', 'error', null, error.message);
    }
  };

  const testNotificationGetNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      addResult('GET /api/notifications', 'success', data);
    } catch (error: any) {
      addResult('GET /api/notifications', 'error', null, error.message);
    }
  };

  const testThesisGetTheses = async () => {
    try {
      const data = await thesisService.getTheses();
      addResult('GET /api/thesis', 'success', data);
    } catch (error: any) {
      addResult('GET /api/thesis', 'error', null, error.message);
    }
  };

  const testThesisGroupsGetById = async () => {
    try {
      const data = await thesisGroupsService.getThesisGroupById('1');
      addResult('GET /api/thesis-groups/:id', 'success', data);
    } catch (error: any) {
      addResult('GET /api/thesis-groups/:id', 'error', null, error.message);
    }
  };

  const testThesisRoundsUpdate = async () => {
    try {
      const data = await thesisRoundsService.updateThesisRound(1, {} as any);
      addResult('PUT /api/admin/thesis-rounds/:id', 'success', data);
    } catch (error: any) {
      addResult('PUT /api/admin/thesis-rounds/:id', 'error', null, error.message);
    }
  };

  const testAll = async () => {
    setIsLoading(true);
    setResults([]);

    await testAuthMe();
    await testAIChatSendMessage();
    await testChatboxGetMessages();
    await testChatboxGetConversations();
    await testLMSGetCourses();
    await testCMSGetContent();
    await testNotificationGetNotifications();
    await testThesisGetTheses();
    await testThesisGroupsGetById();
    await testThesisRoundsUpdate();

    setIsLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">API Gateway Test Page</h1>
      
      <div className={`mb-6 p-4 rounded-lg ${
        gatewayStatus === 'online' ? 'bg-green-100 border border-green-300' :
        gatewayStatus === 'offline' ? 'bg-red-100 border border-red-300' :
        'bg-yellow-100 border border-yellow-300'
      }`}>
        <div className="flex items-center gap-2">
          <span className="font-semibold">API Gateway Status:</span>
          <span className={`px-3 py-1 rounded text-sm ${
            gatewayStatus === 'online' ? 'bg-green-500 text-white' :
            gatewayStatus === 'offline' ? 'bg-red-500 text-white' :
            'bg-yellow-500 text-white'
          }`}>
            {gatewayStatus === 'online' ? 'ONLINE' :
             gatewayStatus === 'offline' ? 'OFFLINE' :
             'CHECKING...'}
          </span>
        </div>
        {gatewayStatus === 'offline' && (
          <p className="text-red-700 text-sm mt-2">
            API Gateway không khả dụng. Hãy chắc chắn rằng API Gateway đang chạy tại http://localhost:3000
          </p>
        )}
      </div>
      
      <div className="mb-6 flex gap-4">
        <button
          onClick={testAll}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Testing All APIs...' : 'Test All APIs'}
        </button>
        <button
          onClick={clearResults}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Clear Results
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button onClick={testAuthMe} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test Auth: GET /api/auth/me
        </button>
        <button onClick={testAIChatSendMessage} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test AI Chat: POST /api/chat/message
        </button>
        <button onClick={testChatboxGetMessages} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test Chatbox: GET /api/chatbox/messages
        </button>
        <button onClick={testChatboxGetConversations} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test Chatbox: GET /api/chatbox/conversations
        </button>
        <button onClick={testLMSGetCourses} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test LMS: GET /api/courses
        </button>
        <button onClick={testCMSGetContent} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test CMS: GET /api/content
        </button>
        <button onClick={testNotificationGetNotifications} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test Notification: GET /api/notifications
        </button>
        <button onClick={testThesisGetTheses} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test Thesis: GET /api/thesis
        </button>
        <button onClick={testThesisGroupsGetById} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test Thesis Groups: GET /api/thesis-groups/:id
        </button>
        <button onClick={testThesisRoundsUpdate} className="p-4 bg-gray-100 rounded hover:bg-gray-200 text-left">
          Test Thesis Rounds: PUT /api/admin/thesis-rounds/:id
        </button>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Test Results</h2>
        {results.length === 0 && <p className="text-gray-500">No tests run yet</p>}
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              result.status === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-semibold ${result.status === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {result.name}
              </span>
              <span className={`px-2 py-1 rounded text-xs ${
                result.status === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {result.status.toUpperCase()}
              </span>
            </div>
            {result.error && (
              <p className="text-red-600 text-sm mt-1">Error: {result.error}</p>
            )}
            {result.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600">View Response Data</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-64">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
