import React, { useState } from 'react'
import Image from '../../avatar/avatar'
import './item.scss'
import $ from 'jquery'
import { useDispatch } from 'react-redux'
import { showCenter, showFeature } from '../../../../../redux/actions/taskbar'

function Item({id, name, image, addFriend, createGroup}) {
    
    /*----redux----*/
    //ket noi den redux
    const dispatch = useDispatch()
    
    /*----states----*/
    const [checked, setChecked] = useState(false)

    /*----handles----*/
    //xu ly nhan vao item 
    const handleClickToCheckFriend = (e) => { 
        if(createGroup) {
            $(e.currentTarget).find('.friend-add-friend-checkbox').attr('checked', checked ? false : true)
            setChecked(checked ? false : true)
        }
        $(e.currentTarget).addClass('active-friend-group-item')
        for(let val of $('.friend-group-item')) {
            if(val !== e.currentTarget) {
                $(val).removeClass('active-friend-group-item')
            }
        }
        $('#tab-wrapper').toggleClass('hide-tab-in-phones-screen')
        $('.main-chat-center').toggleClass('show-main-chat-phone-screen')
        const display = showCenter(1)
        dispatch(display)
    }

    //xu ly show khung mo rong
    const handleClickToShowFeature = (e) => {
        e.stopPropagation()
        const top = $(window).height() <=$(e.target).offset().top + 100 ? $(e.target).offset().top - 60 : $(e.target).offset().top
        const left = $(window).width() <=$(e.target).offset().left + 100 ? $(e.target).offset().left - 180 : $(e.target).offset().left
        const feature = {
            group: typeof id === 'number' ? 0 : 1,
            isShow: 1,
            id: 1,
            offset: {
                top: top,
                left: left
            }
        }
        const display = showFeature(feature)
        dispatch(display)
    }

    //xy ly thay doi checked
    const handleChangeChecked = (e)=>{
        setChecked(e.target.checked)
    }



    return (
        <div className="friend-group-item" data-id={id} onClick={handleClickToCheckFriend}>
            <div className="friend-group-avatar">
                <Image image={image ? image : undefined}></Image>
            </div>
            <div className="friend-group-info">
                <p className="friend-group-name">{name}</p>
            </div>
            {
            addFriend ?  
            <button className="friend-add-friend-btn">Kết bạn</button> : 
            createGroup ?
            <input type="checkbox"  className="friend-add-friend-checkbox" checked={checked} onChange={handleChangeChecked}/> :
            <>
                <div className='tab-friend-feature-item-show other-feature' style={{visibility: addFriend ? 'visible': ''}} onClick={handleClickToShowFeature}>
                {
                    <svg 
                        className="tab-friend-feature-item-show"
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        fill="currentColor" 
                        viewBox="0 0 16 16">
                        <path className="tab-friend-feature-item-show" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                }
                </div>
            </>
            }   
        </div>
    )
}

export default Item