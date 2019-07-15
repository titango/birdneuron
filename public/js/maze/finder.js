function Finder(){
    this.started = false;
    
    this.paths = [new path(0, longest.i+longest.j*cols)];

    this.draw = function(){
        //frameRate(5);
        this.paths[0].update();
        this.paths[0].draw();
    }
}

function path(cur, to){
    this.pcells = [];
    this.stack = [];
    this.way = [];
    this.removeOptions = [];
    this.found = false;
    this.distance = 0;
    for(var j=0;j<rows;j++){
        for(var i=0;i<cols;i++){
            this.pcells[i+j*cols] = new finderCells(i,j);
            this.pcells[i+j*cols].walls = cells[i+j*cols].walls;
        }
    }
    this.current = this.pcells[cur];
    this.current.visited = true;
    this.to = this.pcells[to];

    this.update = function(){
        //if(this.found) frameRate(5);
        if(this.current)
        var avail = this.current.avails(this.pcells);

        if(avail && avail.length>0 && !this.found){ //check if avail >= 3
            var go = mazeP5.random(avail);
            // var go = avail[0];
            go.visited = true;

            // for(var j=1;j<avail.length;j++){
            //     this.removeOptions = [];
            //     this.removeOptions.push(avail[j]);
            // }

            
            this.stack.push(go);
            this.current = go;
        }
        else{
            
            this.current = this.stack.pop();
            if(this.current && this.current.visited && this.found){
                // if(this.current.i !=){

                // }
                this.way.push(this.current);
            }
            
            if(this.current == this.to) this.found = true;
        }
        
    }

    this.draw = function(){
        mazeP5.fill(255);
        if(this.current)
        this.current.draw();
            for(var i=0;i<this.way.length;i++){
                // console.log(this.way);
                mazeP5.stroke(100,255,100);
                if(this.way[i+1]){
                    mazeP5.line(w*this.way[i].i+w/2,w*this.way[i].j+w/2,w*this.way[i+1].i+w/2,w*this.way[i+1].j+w/2);
                }
            }
        
    }
}

function finderCells(i,j){
    this.i = i;
    this.j = j;
    this.visited = false;
    this.walls = [];

    this.draw = function(){
        this.drawWalls();
        mazeP5.ellipse(w*this.i+w/2, w*this.j+w/2, 10, 10);
    }

    this.avails = function(pcells){
        var av = [];
        var top = pcells[index(this.i,this.j-1)];
        var right = pcells[index(this.i+1,this.j)];
        var bottom = pcells[index(this.i,this.j+1)];
        var left = pcells[index(this.i-1,this.j)];
        if(top && !this.walls[0] && !top.visited)
            av.push(top);
        if(right && !this.walls[1] && !right.visited)
            av.push(right);
        if(bottom && !this.walls[2] && !bottom.visited)
            av.push(bottom);
        if(left && !this.walls[3] && !left.visited)
            av.push(left);
        return av;
    }

    this.drawWalls = function(){
        mazeP5.stroke(255);
        if(!this.walls[0])
            mazeP5.line(w*this.i+w/2,w*this.j+w/2,w*this.i+w/2,w*this.j);
        if(!this.walls[1])
            mazeP5.line(w*this.i+w/2,w*this.j+w/2,w*this.i+w,w*this.j+w/2);
        if(!this.walls[2])
            mazeP5.line(w*this.i+w/2,w*this.j+w/2,w*this.i+w/2,w*this.j+w);
        if(!this.walls[3])
            mazeP5.line(w*this.i+w/2,w*this.j+w/2,w*this.i,w*this.j+w/2);

    }

}