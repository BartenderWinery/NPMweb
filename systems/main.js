const{app,BrowserWindow,shell}=require("electron")
var fs,prc=null
function popout(bounds,page){
    var win=new BrowserWindow({
        width:bounds[0],
        height:bounds[1],
        frame:false,
        show:false,
        backgroundColor:"#383838",
        webPreferences:{
            nodeIntegration:false,
            contextIsolation:true,
            enableRemoteModule:false,
            preload:(__dirname+"/preload.js")}})
        win.loadFile([...__dirname.split("/").slice(0,-1),...[page]].join("/"))}
async function main(){
    popout([580,300],"index.html")
    var wins=BrowserWindow.getAllWindows()
    wins[0].webContents.once("did-finish-load",()=>{
        const {ipcMain}=require("electron")
        prc=require("child_process")
        fs=require("fs")
        //add clipboard formating for real area select
        ipcMain.on("minimize",()=>{BrowserWindow.getFocusedWindow().minimize()})
        ipcMain.on("maximize",()=>{
            var f=BrowserWindow.getFocusedWindow()
            if(f.isFullScreen())f.setFullScreen(false)
            else f.setFullScreen(true)})
        ipcMain.on("close",()=>{BrowserWindow.getFocusedWindow().close()})
        ipcMain.on("popout",(events,args)=>{popout([400,220],args)})
        ipcMain.on("reboot",()=>{
            app.relaunch()
        	app.exit(0)})
        wins[0].show()
        wins[0].webContents.executeJavaScript("window.onload()")})}
app.on("ready",main)
var sys={
    callback:function(i,j){BrowserWindow.getAllWindows().find(win=>win.getTitle()==i).webContents.executeJavaScript(j)}}
