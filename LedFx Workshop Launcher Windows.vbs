Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

root = fso.GetParentFolderName(WScript.ScriptFullName)
scriptPath = fso.BuildPath(root, "scripts\launch_workshop.ps1")
command = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File " & Quote(scriptPath)

shell.Run command, 0, False

Function Quote(value)
  Quote = """" & Replace(value, """", """""") & """"
End Function
