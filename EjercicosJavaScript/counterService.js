let count = 0;

export function getCount(){
    return count;
}

export function increment(){
    count++;
    return count;
}

export function reset(){
    count = 0;
    return count;
} 