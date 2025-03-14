window.saveutil={}
saveutil.latest_version=2.001
saveutil.clear=()=>{
    localStorage.removeItem("clickersave")
}
saveutil.export=()=>{
    const elem=document.createElement("a")
    elem.href=URL.createObjectURL(new Blob([window.btoa(localStorage.getItem("clickersave"))], {}))
    elem.download="たべものクリッカーのセーブ.ymcsave"
    elem.click()
}
saveutil.import=(e)=>{
    if(e.files.length!=0){
        const reader=new FileReader()
        reader.readAsText(e.files[0])
        reader.addEventListener("load",()=>{
            localStorage.setItem("clickersave",atob(reader.result))
            save_on_unload=false
            location.hash="#import-complete"
        })
    }
}
saveutil.version_check=()=>{
    save=JSON.parse(localStorage.getItem("clickersave"))
    if(save.version){
        return save.version
    }
    return 0
}
saveutil.update_check=()=>{
    return saveutil.version_check()<saveutil.latest_version
}
saveutil.get_save=()=>JSON.parse(localStorage.getItem("clickersave"))