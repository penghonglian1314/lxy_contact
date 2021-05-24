Component({
  properties: {
    Icon: {
      type: String,
      value: ''
    },
    Text: {
      type: String,
      value: ''
    }
  },
  data: {
    display: 'none', // 控制弹窗消失/显示
    width: '', // 字数较少时充当占位符
    show: false,
    iconDisplay: 'block',
    test_box: 'test_box',
    test: 'test',
    text: 'text'
  },

    /**
   * 组件生命周期函数--监听页面加载
   */
  attached(){
  },
  methods: {
    // 
    show: function(params) {
      console.log('提示框所需参数', params)
      if (params.Text.length <= 6) {
        console.log('字数少于且包括6个字触发')
        this.setData({
          width: 100
        })
      }
      // 
      if (params.Icon && params.Text) {
        // 参数同时存在
        this.setData({
          display: 'inline-block',
          show: true,
          Icon: params.Icon,
          Text: params.Text
        })
        setTimeout(()=>{
        this.setData({
          show: false,
          display: 'none',
        })
        }, 2000)
      } else {
        console.log('缺少参数')
        this.setData({
          display: 'inline-block',
          show: true,
          Icon: params.Icon,
          Text: params.Text,
          iconDisplay: 'none',
          test_box: 'test_box1',
          test: 'test1',
          text: 'text1'
        })
        
        setTimeout(()=>{
          this.setData({
            show: false,
            display: 'none',
          })
          }, 2000)
      }
    }
  }
})