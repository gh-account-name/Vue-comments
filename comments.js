const Comments = {
    data(){
        return{
            comments: [],
            inputName: '',
            inputEmail:'',
            inputComment: '',
            dialogOpen: false,
            sortOptions: [
                {value:'', name: "Без сортировки"},
                {value:'name', name:'По имени'},
                {value:'email', name:"По эл. почте"},
                {value: 'body', name:'По тексту'}
            ],
            selectedOption:'',
            searchValue:'',
            filterOptions:[
                {value:[-Infinity,Infinity], name:"Все"},
                {value:[-Infinity,30], name:"меньше 30 символов"},
                {value:[30,60], name:"от 30 до 60 символов"},
                {value:[60,Infinity], name:"больше 60 символов"},
            ],
            selectedFilterOption: [-Infinity,Infinity],
            reverseChecked: false,
        }
    },
    methods:{
        async updateCommentsData(){
            this.comments = await (await fetch('https://jsonplaceholder.typicode.com/comments?_limit=30')).json();
        },
        deleteComment(comment){
            this.comments = this.comments.filter(elem=>elem.id!==comment.id)
        },
        addComment(){
            if (this.inputName!='' && this.inputEmail!='' && this.inputComment!=''){
                let newComment = {
                    id: String(Date.now()).slice(-6),
                    name: this.inputName,
                    email: this.inputEmail,
                    body: this.inputComment,
                };
                this.comments.unshift(newComment);
                this.inputName='';
                this.inputEmail='';
                this.inputComment='';
                this.hideForm();
            } else {
                alert('Пожалуйста заполните все поля')
            }
        },
        showForm(){
            this.dialogOpen=true;
            document.querySelector('dialog').style.top=`${window.innerHeight/2 + window.pageYOffset}px`
            document.querySelector('.blackBackground').style.top = `${window.pageYOffset}px`
            document.querySelector('.blackBackground').style.display='block';
            document.body.style.overflow = 'hidden';
        },
        hideForm(){
            this.dialogOpen=false;
            document.querySelector('.blackBackground').style.display='none';
            document.body.style.overflow = 'auto';
        },
        changeCheckbox(){
            this.reverseChecked=!this.reverseChecked;
        }
    },
    mounted(){
        this.updateCommentsData()
    },
    computed:{
        sortComments(){
            return [...this.comments].sort((coment1,coment2)=>coment1[this.selectedOption]?.localeCompare(coment2[this.selectedOption]))
        },
        sortAndSearch(){
            return this.sortComments.filter(coment=>{
                if (coment.name.includes(this.searchValue.toLowerCase()) || coment.body.includes(this.searchValue.toLowerCase())){
                    return true
                } 
            })
        },
        filterSimbolsAmount(){
            return this.sortAndSearch.filter(coment=>{
                if (coment.body.length>=this.selectedFilterOption[0] && coment.body.length<=this.selectedFilterOption[1]){
                    return true
                }
            })
        },
        reverseSortAndSearch(){
            if (this.reverseChecked) {
                return [...this.filterSimbolsAmount].reverse()
            } else {
                return this.filterSimbolsAmount
            }
        }
    },
}

Vue.createApp(Comments).mount('body')