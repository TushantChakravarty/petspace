import AsyncStorage from "@react-native-async-storage/async-storage"

export const addToBookmark = (item)=>{
    const bookmarkData = item
    console.log(bookmarkData.add)
    if(bookmarkData.add)
    {

        AsyncStorage.getItem('bookmarks')
        .then((bookmarks)=>{
            let allBookMarks =[]
            const BookMarks = JSON.parse(bookmarks)
            console.log("My Book Marks",BookMarks)
            if(BookMarks!=null)
            {

                if(BookMarks.length!=0 && BookMarks!=undefined)
                {
                    //allBookMarks.push(BookMarks)
                    BookMarks.map((item)=>{
                        allBookMarks.push(item)
                    })
                    allBookMarks.push(bookmarkData)
                }
            }
                else{
                allBookMarks.push(bookmarkData)
            }
             console.log("Final Data",allBookMarks)
             AsyncStorage.setItem('bookmarks',JSON.stringify(allBookMarks))
        })
    }else{
        console.log('removing from book marks')
        AsyncStorage.getItem('bookmarks')
        .then((bookmarks)=>{
            const BookMarks = JSON.parse(bookmarks)
            console.log("My Book Marks",BookMarks)
            if(BookMarks)
            {
                let updatedBookmarks =[]
                const result = BookMarks.filter((data)=>{
                    console.log('deleting',item)
                    return data.details._id!=item.details._id
                })
                //updatedBookmarks.push(result)
                //console.log(updatedBookmarks)
               console.log(result)
                AsyncStorage.setItem('bookmarks',JSON.stringify(result))

            }
            else{
                console.log("Nothing to delete ")
            }
            })

    }

}