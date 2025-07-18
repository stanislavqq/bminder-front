import { useAPIConnection } from "@/lib/api-config";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, WifiOff, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function APIStatus() {
  const { isConnected, isChecking, checkConnection } = useAPIConnection();

  const getStatusColor = () => {
    if (isChecking) return "bg-gray-100 text-gray-800";
    return isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = () => {
    if (isChecking) return "Проверка соединения...";
    return isConnected ? "API подключен" : "API недоступен";
  };

  const getStatusIcon = () => {
    if (isChecking) return <Loader2 className="h-4 w-4 animate-spin" />;
    return isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />;
  };

  return (
    <Card className="bg-white border-slate-200 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor()}>
              {getStatusIcon()}
              <span className="ml-2">{getStatusText()}</span>
            </Badge>
            {!isConnected && !isChecking && (
              <p className="text-sm text-slate-600">
                Убедитесь, что внешний API запущен и доступен
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={checkConnection}
            disabled={isChecking}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Проверить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}