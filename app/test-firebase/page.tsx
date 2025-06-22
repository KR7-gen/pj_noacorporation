'use client';

import { useEffect, useState } from 'react';
import { testFirebaseConnection, getVehicles, getStores } from '@/lib/firebase-utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestFirebasePage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('テスト未実行');
  const [testResults, setTestResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const runConnectionTest = async () => {
    setLoading(true);
    setConnectionStatus('テスト実行中...');
    
    try {
      const isConnected = await testFirebaseConnection();
      setConnectionStatus(isConnected ? '接続成功 ✅' : '接続失敗 ❌');
      
      if (isConnected) {
        // 実際のデータ取得テスト
        const results: any = {};
        
        try {
          const vehicles = await getVehicles();
          results.vehicles = `成功: ${vehicles.length}件の車両データを取得`;
        } catch (error) {
          results.vehicles = `失敗: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        
        try {
          const stores = await getStores();
          results.stores = `成功: ${stores.length}件の店舗データを取得`;
        } catch (error) {
          results.stores = `失敗: ${error instanceof Error ? error.message : 'Unknown error'}`;
        }
        
        setTestResults(results);
      }
    } catch (error) {
      setConnectionStatus(`エラー: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Firebase接続テスト</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>接続状況</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">ステータス: <span className="font-semibold">{connectionStatus}</span></p>
          <Button 
            onClick={runConnectionTest} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'テスト実行中...' : '接続テスト実行'}
          </Button>
        </CardContent>
      </Card>

      {Object.keys(testResults).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>データ取得テスト結果</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(testResults).map(([key, value]) => (
              <div key={key} className="mb-2">
                <strong>{key}:</strong> {value}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 