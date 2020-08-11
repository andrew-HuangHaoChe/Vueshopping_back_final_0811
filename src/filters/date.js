export default function(time){
    const date = new Date(time * 1000);
    // console.log(date.toLocaleDateString());
    return date.toLocaleDateString();;
    
}

