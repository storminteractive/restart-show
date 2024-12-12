
# Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser

function CheckProcessRunning {
    param ([string]$CmdString)

    if (Get-WmiObject Win32_Process | Where-Object { $_.Name -eq "node.exe" } | Where-Object { $_.CommandLine -like "*$CmdString*" } | Select-Object Name, ProcessId, CommandLine) {
        Write-Output "$CmdString is running."
    } else {
        Write-Output "$CmdString failed to start."
    }
}

function KillProcessByCommandLine {
    param ([string]$CmdString)

    # Get processes matching the name and CommandLine substring
    $processes = Get-WmiObject Win32_Process | Where-Object { $_.Name -eq "node.exe" -and $_.CommandLine -like "*$CommandLineSubstring*" }
    
    if ($processes) {
        foreach ($process in $processes) {
            try {
                Write-Output "Terminating process: $($process.Name) (PID: $($process.ProcessId)) with CommandLine: $($process.CommandLine)"
                Stop-Process -Id $process.ProcessId -Force
                Write-Output "Process terminated successfully."
            } catch {
                Write-Output "Failed to terminate process: $($_.Exception.Message)"
            }
        }
    } else {
        Write-Output "No process $CmdString found."
    }
}


# Start processes
Write-Output "Starting socket-server.js..."
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "socket-server.js"
Write-Output "Starting video-site.js..."
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "video-site.js"

# sleep 2 seconds
Start-Sleep -Seconds 2

Write-Output "Starting Chrome in fullscreen mode on localhost:5000..."
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--autoplay-policy=no-user-gesture-required --start-fullscreen http://localhost:5000"

Write-Output "Starting control-board.js in foreground..."
node control-board.js

Write-Output "All services started. Press Ctrl+C to stop all services."

# Wait for user input to stop services
do {
    $input = Read-Host "Press 'k' to stop all services"
} while ($input -ne 'k')

Write-Output "Shutting down all services..."
KillProcessByCommandLine "socket-server.js"
KillProcessByCommandLine "video-site.js"
KillProcessByCommandLine "control-board.js"

Write-Output "All services stopped."