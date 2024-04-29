window.addEventListener("load",()=>{
    let level=0
    let cps=BigInt(0)
    let cpc=BigInt(1)
    let coins=BigInt(0)
    let save_on_unload=true

    let clickAreaCandicates=[]

    const storeItems=[
        {level:0,name:"あめ",asset:"assets/あめ.png",cost:100,cpc:1,cps:0.1,description:"おいしい飴です！"},
        {level:1,name:"クッキー",asset:"assets/クッキー.png",cost:500,cpc:3,cps:0.3,description:"美味しいクッキーです！"},
        {level:2,name:"ケーキ",asset:"assets/ケーキ.png",cost:2500,cpc:5,cps:0.5,description:"甘いケーキです！"},
        {level:3,name:"アイスクリーム",asset:"assets/アイスクリーム.png",cost:6500,cpc:7,cps:1,description:"クールなアイスクリームです！"},
        {level:4,name:"ドーナツ",asset:"assets/ドーナツ.png",cost:10000,cpc:10,cps:3,description:"美味しいドーナツです！"},
        {level:5,name:"チョコレート",asset:"assets/チョコレート.png",cost:25000,cpc:25,cps:5,description:"濃厚なチョコレートです！"},
        {level:6,name:"ロリポップ",asset:"assets/ロリポップ.png",cost:40000,cpc:100,cps:10,description:"甘いロリポップです！"},
        {level:7,name:"ブラウニー",asset:"assets/ブラウニー.png",cost:75000,cpc:250,cps:20,description:"贅沢なブラウニーです！"},
        {level:8,name:"パンケーキ",asset:"assets/パンケーキ.png",cost:150000,cpc:500,cps:50,description:"ふわふわのパンケーキです！"},
        {level:9,name:"ワッフル",asset:"assets/ワッフル.png",cost:250000,cpc:700,cps:100,description:"外はサクサク、中はモッチリなワッフルです！"},
        {level:10,name:"ジュース",asset:"assets/ジュース.png",cost:400000,cpc:1000,cps:200,description:"新鮮なフルーツで作られた健康的なジュースです！"},
    ]

    let itemCounts=[
    ]

    const $coinValue=document.getElementById("coin-value")
    const coinUpdate=()=>{
        $coinValue.textContent=coins
    }
    const costUpdate=(id)=>{
        itemCounts[id].cost=Math.floor(storeItems[id].cost*(1.15**(itemCounts[id].count)))
        itemCounts[id].cps=storeItems[id].cps*itemCounts[id].count
        itemCounts[id].cpc=storeItems[id].cpc*itemCounts[id].count

        new_cps=0
        itemCounts.forEach((e)=>{
            new_cps+=e.cps
        })
        new_cpc=1
        itemCounts.forEach((e)=>{
            new_cpc+=e.cpc
        })
        cps=BigInt(Math.floor(new_cps))
        cpc=BigInt(new_cpc)
        document.getElementById("cps-value").textContent=cps
        document.getElementById("cpc-value").textContent=cpc
        document.querySelector(`.store-items[data-level="${id}"] .store-item-cost`).textContent=itemCounts[id].cost
        document.querySelector(`.store-items[data-level="${id}"] .store-item-count`).textContent=itemCounts[id].count
    }

    const levelFix=()=>{
        document.querySelectorAll(".store-items").forEach((e)=>{
            lv=e.dataset.level*1
            if(level>=lv+1){
                e.classList.add("available-item")
                console.log(level,lv)
                if(level-1>=lv+1){costUpdate(lv)}
            }
        })
        clickAreaCandicates=storeItems.slice(0, Math.max(level-1,1))
    }
    const levelUp=()=>{
        level++
        levelFix()
    }

    window.buy=(id)=>{
        
        if(!itemCounts[id]){
            if(storeItems[id].cost>coins){
                return
            }
            itemCounts[id]={count:0,cps:0,cpc:0,cost:storeItems[id].cost}
            levelUp()
        }
        if(itemCounts[id].cost>coins){return}
        coins-=BigInt(itemCounts[id].cost)
        itemCounts[id].count++
        costUpdate(id)
        coinUpdate()
    }

    window.pref={}

    storeItems.forEach((e)=>{
        node=document.createElement("div")
        node.classList.add("store-items")
        node.dataset.level=e.level
        node.innerHTML=`<img src="${e.asset}"><div><div class="store-item-title">${e.name}</div><div class="store-item-desc">${e.description}</div></div><table><tr><th>CPC</th><td>${e.cpc}</td></tr><tr><th>CPS</th><td>${e.cps}</td></tr><tr><th>価格</th><td class="store-item-cost">${e.cost}</td></tr><tr><th>所持数</th><td class="store-item-count">0</td></tr></table><button type="button" class="store-buy" onclick="buy(${e.level})">買う</button>`
        document.getElementById("$StoreItemList").appendChild(node)
    })

    const $ClickArea=document.getElementById("$ClickArea")
    $ClickArea.addEventListener("click",()=>{
        coins+=cpc
        coinUpdate()
        $ClickArea.src=clickAreaCandicates[Math.floor(Math.random() * clickAreaCandicates.length)].asset
    })
    setInterval(()=>{
        coins+=cps
        coinUpdate()
    },1000)
    const save=()=>{
        localStorage.setItem("clickersave",JSON.stringify({itemCounts:itemCounts,coins:coins.toString(),level:level,timestamp:Date.now()/1000}))
        document.getElementById("$SaveInfoSaveTime").textContent=Date()
    }
    const load=()=>{
        if(localStorage.getItem("clickersave")){
            savedata=JSON.parse(localStorage.getItem("clickersave"))
            itemCounts=savedata.itemCounts
            coins=BigInt(savedata.coins)
            level=savedata.level
            levelFix()
        
            document.getElementById("$SaveInfoLastSaveTime").textContent=document.getElementById("$SaveInfoSaveTime").textContent=new Date(savedata.timestamp*1000).toString()
            document.getElementById("$SaveInfoLastSaveCoin").textContent=coins
            document.getElementById("$SaveInfoLastSaveLevel").textContent=level-1
        }else{
            itemCounts=[]
            coins=BigInt(0)
            levelUp()
        }
    }
    window.saveutil={}
    saveutil.save=save
    saveutil.load=load
    saveutil.clear=()=>{
        save_on_unload=false
        if(confirm("セーブデータを削除してもよろしいですか?")){
            if(confirm("この操作で次のデータが削除されます。\n- コイン、たべものを含む全てのゲームデータ\n次のデータは残ります。\n- 設定\n続行しますか?\nこの操作はバックアップをしていない限り元に戻せません。")){
                localStorage.removeItem("clickersave")
                if(confirm("データの削除が完了しました。このまま新しいゲームを開始しますか?")){
                    location.reload(true)
                }else{
                    window.close()
                }
            }
        }
    }
    saveutil.export=()=>{
        const elem=document.createElement("a")
        save()
        elem.href=URL.createObjectURL(new Blob([window.btoa(localStorage.getItem("clickersave"))], { "type" : "text/plain" }))
        elem.download="たべものクリッカーのセーブ.ymcsave"
        elem.click()
    }
    saveutil.import=(e)=>{
        if(e.files.length!=0){
            const reader=new FileReader()
            reader.readAsText(e.files[0])
            reader.addEventListener("load",()=>{
                if(confirm("現在のセーブを置き換える前に、現在のデータをエクスポートしますか?")){
                    saveutil.export()
                }
                localStorage.setItem("clickersave",atob(reader.result))
                save_on_unload=false
                location.reload()
            })
        }
    }
    
    document.getElementById("$PreferenceToggle").addEventListener("click",()=>{
        document.body.classList.toggle("settings-mode")
    })
    window.addEventListener("beforeunload",(e)=>{
        if(save_on_unload){save()}
    })
    load()
    setTimeout(()=>{document.body.classList.remove("loading")},1000)
})